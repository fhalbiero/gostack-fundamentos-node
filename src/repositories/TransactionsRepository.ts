import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}


interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}


class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Response {
    const response = {
      transactions: this.transactions,
      balance: this.getBalance()
    }
    return response;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;
    for (const transaction of this.transactions) {
      if (transaction.type === 'income') {
        income += transaction.value;
      } else {
        outcome += transaction.value;
      }
    }
    
    const balance = {
      income,
      outcome,
      total: income - outcome
    }

    return balance
  }

  public create({title, type, value}: TransactionDTO): Transaction {
  
    if (type === 'outcome') {
      const balance = this.getBalance();

      if (balance.total < value) {
        throw Error("You do not have enough balance");
      }
    }
   
    const transaction = new Transaction({title, type, value});

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
