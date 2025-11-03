;; title: keybit
;; version: 0.1.0
;; summary: A simple faucet-style fungible token for demonstration
;; description: Each principal can claim a fixed amount of KEYBIT once; holders can transfer tokens.

;; constants
(define-constant NAME "KeyBit")
(define-constant SYMBOL "KEYBIT")
(define-constant DECIMALS u6)
(define-constant CLAIM-AMOUNT u1000)

;; data vars
(define-data-var total-supply uint u0)

;; data maps
(define-map balances { account: principal } { amount: uint })
(define-map claimed { account: principal } { claimed: bool })

;; public functions
(define-public (claim)
  (begin
    (match (map-get? claimed { account: tx-sender })
      some-claim (err u1)                             ;; already claimed
      (let
        (
          (current (get-balance-internal tx-sender))
          (new-balance (+ current CLAIM-AMOUNT))
        )
        (map-set balances { account: tx-sender } { amount: new-balance })
        (map-set claimed { account: tx-sender } { claimed: true })
        (var-set total-supply (+ (var-get total-supply) CLAIM-AMOUNT))
        (ok true)
      )
    )
  )
)

(define-public (transfer (amount uint) (to principal))
  (let
    (
      (from tx-sender)
      (from-balance (get-balance-internal tx-sender))
    )
    (if (< from-balance amount)
      (err u2) ;; insufficient balance
      (let
        (
          (to-balance (get-balance-internal to))
          (new-from (- from-balance amount))
          (new-to (+ to-balance amount))
        )
        (begin
          (map-set balances { account: from } { amount: new-from })
          (map-set balances { account: to } { amount: new-to })
          (ok true)
        )
      )
    )
  )
)

;; read only functions
(define-read-only (get-name)
  NAME
)

(define-read-only (get-symbol)
  SYMBOL
)

(define-read-only (get-decimals)
  DECIMALS
)

(define-read-only (get-balance (account principal))
  (get-balance-internal account)
)

(define-read-only (get-total-supply)
  (var-get total-supply)
)

;; private functions
(define-private (get-balance-internal (account principal))
  (match (map-get? balances { account: account })
    entry (get amount entry)
    u0
  )
)
