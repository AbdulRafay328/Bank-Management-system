import inquirer from "inquirer";
import { faker, Faker } from "@faker-js/faker";
import chalk from "chalk";

class customer {
  fname: string;
  lname: string;
  age: number;
  gender: string;
  mobilenumber: number;
  accountnumber: number;

  constructor(
    fname: string,
    lname: string,
    age: number,
    gender: string,
    mobilenumber: number,
    accountnumber: number
  ) {
    this.fname = fname;
    this.lname = lname;
    this.age = age;
    this.gender = gender;
    this.mobilenumber = mobilenumber;
    this.accountnumber = accountnumber;
  }
}

interface Bankaccount {
  accountno: Number;
  balance: number;
}

class Bank {
  Customer: customer[] = [];
  account: Bankaccount[] = [];
  addcustomer(obj: customer) {
    this.Customer.push(obj);
  }
  addaccount(obj: Bankaccount) {
    this.account.push(obj);
  }
  transaction(obj: Bankaccount) {
    let newaccount = this.account.filter(
      (account) => account.accountno !== obj.accountno
    );
    this.account = [...newaccount, obj];
  }
}

let mybank = new Bank();

for (let i = 1; i < 6; i++) {
  let fname = faker.person.firstName("male");
  let lname = faker.person.lastName("male");
  let mobilenumber = parseInt(faker.phone.number("3##########"));
  const cus = new customer(
    fname,
    lname,
    20 * i,
    "Male",
    mobilenumber,
    1000 + i
  );
  mybank.addcustomer(cus);
  mybank.addaccount({ accountno: cus.accountnumber, balance: 100 * i });
}

async function Bankservice(Bank: Bank) {
  do {
    let services = await inquirer.prompt({
      type: "list",
      name: "Select",
      message: "Please enter your service",
      choices: ["View balance", "Cash withdraw", "Cash Deposite", "Exit"],
    });
    if (services.Select == "View balance") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please enter your account number",
      });
      let account = mybank.account.find((acc) => acc.accountno == res.num);
      if (!account) {
        console.log(chalk.bold.red.italic("Invalid account number"));
      }
      if (account) {
        let name = mybank.Customer.find(
          (acc) => acc.accountnumber == account?.accountno
        );
        console.log(
          `Dear${chalk.green.italic(name?.fname)}${chalk.green.italic(
            name?.lname
          )} Your account balance is ${chalk.blue.bold(`$${account.balance}`)} `
        );
      }
    }
    if (services.Select == "Cash withdraw") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please enter your account number",
      });
      let account = mybank.account.find((acc) => acc.accountno == res.num);
      if (!account) {
        console.log(chalk.bold.red.italic("Invalid account number"));
      }
      if (account) {
        let res = await inquirer.prompt({
          type: "number",
          name: "rupee",
          message: "Please enter your amount",
        });
        if (res.rupee > account.balance) {
          console.log(chalk.bold.red("Insufficient Balance"));
        }
        let newballance = account.balance - res.rupee;
        Bank.transaction({
          accountno: account.accountno,
          balance: newballance,
        });
      }
    }
    if (services.Select == "Cash Deposite") {
      let res = await inquirer.prompt({
        type: "input",
        name: "num",
        message: "Please enter your account number",
      });
      let account = mybank.account.find((acc) => acc.accountno == res.num);
      if (!account) {
        console.log(chalk.bold.red.italic("Invalid account number"));
      }
      if (account) {
        let res = await inquirer.prompt({
          type: "number",
          name: "rupee",
          message: "Please enter your amount",
        });
        let newballance = account.balance + res.rupee;
        Bank.transaction({
          accountno: account.accountno,
          balance: newballance,
        });
      }
    }
    if (services.Select == "Exit") {
      return;
    }
  } while (true);
}
Bankservice(mybank);
