---
name: receipt-to-coinpile
title: "Log a receipt in Coinpile"
description: "The person shows a photo of a receipt or asks to log one: read it, check whether the bank already sent that payment, then record it or fix its category in Coinpile."
who: [admin, adult]
---
1. Read the receipt: the shop, the date, the total paid (after tax and tip), and how it was paid (cash, or a card and its last 4 digits). If the total or the date isn't clear, ask. Never guess a number.
2. Look for it first. Call coinpile_search_transactions with min_amount and max_amount both set to the total, start 2 days before the receipt's date and end 5 days after. Card payments usually come from the bank within a few days.
3. If it's already there, say so (its description, date and account), and don't record it again. If its category is empty or doesn't fit, set one with coinpile_set_transaction_category.
4. If it isn't there:
   - Paid in cash: call coinpile_list_accounts and use the cash account. If there is none, or more than one, ask which account. Record it with coinpile_record_transaction: amount negative (money out), description the shop's name, the receipt's date, and a category that fits (Groceries, Dining, Fuel, Household...).
   - Paid by card: say the bank usually sends it in 1 to 3 days, and recording it now would count it twice. Record it only if they say the bank never sends it.
5. Don't ask "shall I?" in words first. Call the tool: FAITH shows the person exactly what will change and waits for their Yes.
6. If they ask what was on it, read the items from the photo. Coinpile keeps the total, not the items.
