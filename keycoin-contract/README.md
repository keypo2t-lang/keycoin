# Keycoin Smart Contract

A SIP-010 compliant fungible token smart contract built with Clarinet for the Stacks blockchain.

## Overview

Keycoin (KEY) is a simple fungible token that implements the SIP-010 standard, providing basic token functionality including minting, transferring, and burning capabilities. The contract is designed to be secure, efficient, and fully compliant with Stacks ecosystem standards.

## Features

- **SIP-010 Compliance**: Fully implements the SIP-010 fungible token standard
- **Minting**: Contract owner can mint new tokens
- **Transferring**: Standard token transfers between users
- **Burning**: Token holders and contract owner can burn tokens
- **Metadata**: Configurable token URI for additional metadata
- **Access Control**: Owner-only functions for administrative operations

## Token Details

- **Name**: Keycoin
- **Symbol**: KEY
- **Decimals**: 6
- **Standard**: SIP-010

## Contract Functions

### Public Functions

#### `transfer`
```clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))))
```
Transfer tokens from sender to recipient. Can be called by the token owner or authorized contracts.

#### `mint`
```clarity
(define-public (mint (amount uint) (recipient principal)))
```
Mint new tokens to a recipient. Only callable by the contract owner.

#### `burn`
```clarity
(define-public (burn (amount uint) (owner principal)))
```
Burn tokens from an owner's balance. Can be called by the token owner or contract owner.

#### `set-token-uri`
```clarity
(define-public (set-token-uri (uri (string-utf8 256))))
```
Set the token URI for metadata. Only callable by the contract owner.

### Read-Only Functions

#### `get-name`
Returns the token name ("Keycoin").

#### `get-symbol`
Returns the token symbol ("KEY").

#### `get-decimals`
Returns the number of decimals (6).

#### `get-balance`
```clarity
(define-read-only (get-balance (owner principal)))
```
Returns the token balance for a given principal.

#### `get-total-supply`
Returns the total supply of tokens.

#### `get-token-uri`
Returns the current token URI.

#### `get-contract-owner`
Returns the contract owner principal.

## Error Codes

- `u100`: Owner only - Function can only be called by contract owner
- `u101`: Not token owner - Sender is not authorized to perform this action
- `u102`: Insufficient balance - Not enough tokens in balance
- `u103`: Invalid amount - Amount must be greater than zero

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Node.js and npm (for testing)

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd keycoin-contract
```

2. Install dependencies:
```bash
npm install
```

### Development

#### Check contract syntax:
```bash
clarinet check
```

#### Run tests:
```bash
npm test
```

#### Start local development environment:
```bash
clarinet integrate
```

### Deployment

#### Deploy to Devnet:
```bash
clarinet deploy --devnet
```

#### Deploy to Testnet:
```bash
clarinet deploy --testnet
```

#### Deploy to Mainnet:
```bash
clarinet deploy --mainnet
```

## Testing

The contract includes comprehensive tests covering all major functionality:

- Token minting
- Token transfers
- Token burning
- Access control
- Error handling
- SIP-010 compliance

Run tests with:
```bash
npm test
```

## Security Considerations

- Only the contract owner can mint new tokens
- Transfer functions include proper authorization checks
- All public functions validate input parameters
- Error handling prevents invalid operations
- Burns properly reduce total supply

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository.

## Roadmap

- [ ] Add governance features
- [ ] Implement staking mechanism
- [ ] Add time-locked transfers
- [ ] Create web interface
- [ ] Add multi-signature support

---

**Note**: This contract is provided as-is. Please conduct thorough testing and security audits before using in production environments.