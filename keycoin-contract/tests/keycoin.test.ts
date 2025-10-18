
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Keycoin Contract Tests", () => {
  
  describe("Token Metadata", () => {
    it("should return correct token name", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-name", [], deployer);
      expect(result).toBeOk("Keycoin");
    });

    it("should return correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-symbol", [], deployer);
      expect(result).toBeOk("KEY");
    });

    it("should return correct decimals", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-decimals", [], deployer);
      expect(result).toBeOk(Uint(6));
    });

    it("should return contract owner", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-contract-owner", [], deployer);
      expect(result).toBeOk(deployer);
    });

    it("should return initial total supply of 0", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-total-supply", [], deployer);
      expect(result).toBeOk(Uint(0));
    });
  });

  describe("Token Minting", () => {
    it("should allow owner to mint tokens", () => {
      const mintAmount = 1000000; // 1 token with 6 decimals
      const { result } = simnet.callPublicFn("keycoin", "mint", [
        Uint(mintAmount),
        wallet1
      ], deployer);
      expect(result).toBeOk(true);

      // Check balance
      const { result: balance } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(balance).toBeOk(Uint(mintAmount));

      // Check total supply
      const { result: totalSupply } = simnet.callReadOnlyFn("keycoin", "get-total-supply", [], deployer);
      expect(totalSupply).toBeOk(Uint(mintAmount));
    });

    it("should not allow non-owner to mint tokens", () => {
      const mintAmount = 1000000;
      const { result } = simnet.callPublicFn("keycoin", "mint", [
        Uint(mintAmount),
        wallet1
      ], wallet1);
      expect(result).toBeErr(Uint(100)); // err-owner-only
    });

    it("should not allow minting zero tokens", () => {
      const { result } = simnet.callPublicFn("keycoin", "mint", [
        Uint(0),
        wallet1
      ], deployer);
      expect(result).toBeErr(Uint(103)); // err-invalid-amount
    });
  });

  describe("Token Transfers", () => {
    it("should allow token holder to transfer tokens", () => {
      // First mint tokens
      const mintAmount = 2000000; // 2 tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(mintAmount), wallet1], deployer);

      // Transfer tokens
      const transferAmount = 1000000; // 1 token
      const { result } = simnet.callPublicFn("keycoin", "transfer", [
        Uint(transferAmount),
        wallet1,
        wallet2,
        None()
      ], wallet1);
      expect(result).toBeOk(true);

      // Check balances
      const { result: balance1 } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(balance1).toBeOk(Uint(mintAmount - transferAmount));

      const { result: balance2 } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet2], deployer);
      expect(balance2).toBeOk(Uint(transferAmount));
    });

    it("should not allow unauthorized transfer", () => {
      // First mint tokens to wallet1
      const mintAmount = 1000000;
      simnet.callPublicFn("keycoin", "mint", [Uint(mintAmount), wallet1], deployer);

      // Try to transfer from wallet2 (unauthorized)
      const { result } = simnet.callPublicFn("keycoin", "transfer", [
        Uint(500000),
        wallet1,
        wallet2,
        None()
      ], wallet2);
      expect(result).toBeErr(Uint(101)); // err-not-token-owner
    });

    it("should not allow transfer of zero tokens", () => {
      // First mint tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(1000000), wallet1], deployer);

      const { result } = simnet.callPublicFn("keycoin", "transfer", [
        Uint(0),
        wallet1,
        wallet2,
        None()
      ], wallet1);
      expect(result).toBeErr(Uint(103)); // err-invalid-amount
    });
  });

  describe("Token Burning", () => {
    it("should allow token holder to burn own tokens", () => {
      // First mint tokens
      const mintAmount = 2000000; // 2 tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(mintAmount), wallet1], deployer);

      // Burn tokens
      const burnAmount = 500000; // 0.5 tokens
      const { result } = simnet.callPublicFn("keycoin", "burn", [
        Uint(burnAmount),
        wallet1
      ], wallet1);
      expect(result).toBeOk(true);

      // Check balance
      const { result: balance } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(balance).toBeOk(Uint(mintAmount - burnAmount));

      // Check total supply
      const { result: totalSupply } = simnet.callReadOnlyFn("keycoin", "get-total-supply", [], deployer);
      expect(totalSupply).toBeOk(Uint(mintAmount - burnAmount));
    });

    it("should allow contract owner to burn any user's tokens", () => {
      // First mint tokens
      const mintAmount = 1000000;
      simnet.callPublicFn("keycoin", "mint", [Uint(mintAmount), wallet1], deployer);

      // Owner burns user's tokens
      const burnAmount = 300000;
      const { result } = simnet.callPublicFn("keycoin", "burn", [
        Uint(burnAmount),
        wallet1
      ], deployer);
      expect(result).toBeOk(true);

      // Check balance
      const { result: balance } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(balance).toBeOk(Uint(mintAmount - burnAmount));
    });

    it("should not allow unauthorized burn", () => {
      // First mint tokens to wallet1
      simnet.callPublicFn("keycoin", "mint", [Uint(1000000), wallet1], deployer);

      // Try to burn from wallet2 (unauthorized)
      const { result } = simnet.callPublicFn("keycoin", "burn", [
        Uint(500000),
        wallet1
      ], wallet2);
      expect(result).toBeErr(Uint(101)); // err-not-token-owner
    });

    it("should not allow burning zero tokens", () => {
      // First mint tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(1000000), wallet1], deployer);

      const { result } = simnet.callPublicFn("keycoin", "burn", [
        Uint(0),
        wallet1
      ], wallet1);
      expect(result).toBeErr(Uint(103)); // err-invalid-amount
    });
  });

  describe("Token URI", () => {
    it("should allow owner to set token URI", () => {
      const uri = "https://example.com/keycoin-metadata.json";
      const { result } = simnet.callPublicFn("keycoin", "set-token-uri", [
        uri
      ], deployer);
      expect(result).toBeOk(true);

      // Check if URI was set
      const { result: tokenUri } = simnet.callReadOnlyFn("keycoin", "get-token-uri", [], deployer);
      expect(tokenUri).toBeOk(Some(uri));
    });

    it("should not allow non-owner to set token URI", () => {
      const uri = "https://example.com/keycoin-metadata.json";
      const { result } = simnet.callPublicFn("keycoin", "set-token-uri", [
        uri
      ], wallet1);
      expect(result).toBeErr(Uint(100)); // err-owner-only
    });

    it("should return none for initial token URI", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-token-uri", [], deployer);
      expect(result).toBeOk(None());
    });
  });

  describe("Balance Queries", () => {
    it("should return zero balance for new accounts", () => {
      const { result } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(result).toBeOk(Uint(0));
    });

    it("should return correct balance after minting", () => {
      const mintAmount = 5000000; // 5 tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(mintAmount), wallet1], deployer);

      const { result } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(result).toBeOk(Uint(mintAmount));
    });
  });

  describe("Integration Tests", () => {
    it("should handle complex token operations correctly", () => {
      // Mint tokens to wallet1
      const initialMint = 10000000; // 10 tokens
      simnet.callPublicFn("keycoin", "mint", [Uint(initialMint), wallet1], deployer);

      // Transfer some to wallet2
      const transferAmount = 3000000; // 3 tokens
      simnet.callPublicFn("keycoin", "transfer", [
        Uint(transferAmount),
        wallet1,
        wallet2,
        None()
      ], wallet1);

      // Burn some from wallet1
      const burnAmount = 2000000; // 2 tokens
      simnet.callPublicFn("keycoin", "burn", [
        Uint(burnAmount),
        wallet1
      ], wallet1);

      // Mint more to wallet2
      const additionalMint = 1000000; // 1 token
      simnet.callPublicFn("keycoin", "mint", [Uint(additionalMint), wallet2], deployer);

      // Check final balances
      const { result: balance1 } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet1], deployer);
      expect(balance1).toBeOk(Uint(initialMint - transferAmount - burnAmount)); // 5 tokens

      const { result: balance2 } = simnet.callReadOnlyFn("keycoin", "get-balance", [wallet2], deployer);
      expect(balance2).toBeOk(Uint(transferAmount + additionalMint)); // 4 tokens

      // Check total supply
      const expectedTotalSupply = initialMint - burnAmount + additionalMint; // 9 tokens
      const { result: totalSupply } = simnet.callReadOnlyFn("keycoin", "get-total-supply", [], deployer);
      expect(totalSupply).toBeOk(Uint(expectedTotalSupply));
    });
  });
});
