# keycoin

A Clarinet project containing the `keybit` Clarity smart contract.

## Contract
- Path: `contracts/keybit.clar`
- Summary: Simple faucet-style fungible token. Each principal can call `claim` once to receive a fixed amount, and can `transfer` tokens to others.

## Prerequisites
- Clarinet CLI installed: `clarinet --version`
  - If not installed: `npm install -g @hirosystems/clarinet`

## Quick start
- Validate contracts: `clarinet check`
- Open a REPL: `clarinet console`
