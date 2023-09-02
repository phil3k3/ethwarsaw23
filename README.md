PEERfinance offers an innovative approach to funding early-stage development, making it easier for startups to secure investments in even the most challenging market conditions. Like venture capitalists, traditional avenues often require proof of traction before committing funds. On the other hand, the community is eager to contribute but seeks a meaningful return for their efforts. PEERfinance bridges this gap by introducing a crowdfunding model with a unique twist.

## What Sets PEERfinance Apart

PEERfinance allows startups to crowdsource their development while promising later compensation. Here's how it works:

1. **Crowdfunding with Commitment**: Entrepreneurs can obtain loans from individuals who believe in their project's potential and contribute their time or money. 

2. **Tokenized Contributions**: The value contributed by these backers is tokenized, ensuring the backers can get their funds when the funding arrives.

3. **Unlocking Traction**: With the initial support, startups gain the momentum needed to attract further financing. This approach minimizes dilution for founders, helping them maintain control.

4. **Fair Compensation**: When the primary funding arrives, all contributors can claim their value-added amount and an agreed-upon interest rate.

In essence, PEERfinance empowers startups to access critical early-stage funding while enabling contributors to play an active role in a project's success. It's a win-win scenario that ensures fair compensation for all parties involved, ultimately fueling innovation and growth in the entrepreneurial landscape.

## How we built it
Our custom smart contract creates a value accrual token with a fixed interest rate; the future value of the organization treasury backs that. 

Then, we used a request network for contributors to issue the invoice for the payment. The contributor requests the payment in dollars, which is sent to our smartcontract to calculate n. of loan tokens that equal that amount. 

The invoice is issued in loan tokens and passed to multisig holders.

We use SAFE to review the work and approve and execute the payment. 

Later, we will implement the swap function where contributors can claim repayment of their loan tokens. 

## Challenges we ran into
We ran into many challenges with incomplete documentation, which made it harder to make our innovative solution work. Some of the things that we had to solve were: 
Paying the request has not been working without FEE, which was unclear to us, but we got support from the request team.


## Accomplishments that we're proud of
The token that accrues value over time based on the interest rate can be a very nice incentive for early contributors, even investors, and help multiple startups get off the ground. Together with a trustless and transparent payment process, this can transform the startup industry.


## The Future of PEERfinance
Our next steps involve transitioning PEERfinance from POC to a production-ready version. This pivotal move will pave the way for more startups to access early-stage funding from the community, thereby bolstering innovation on a broader scale.


## What is the process 
**Token Creation:** We create a token worth $1 tied to the organization's future funds.
**Interest and Value Growth:** We set clear interest rates and protections against inflation to ensure the token's value increases over time.
**Contributor's Input:** Contributors offer help worth a certain amount of $ value (let's call it X dollars) to a startup.
**Loan Token Calculation:** Smart contracts determine how much of our loan token (let's call it Y) corresponds to the contributor's X dollars.
**Loan Token Issuance:** Contributors receive Y amount of LOAN tokens based on their input.
**Funding Arrival:** Contributors can reclaim their loans once the organization secures funding.
**Token Conversion:** Contributors can exchange their LOAN tokens for Z dollars. Z is calculated considering X (their initial contribution), the time they held the tokens, and the agreed-upon interest rate (APR). This ensures contributors are fairly rewarded for their early support.
