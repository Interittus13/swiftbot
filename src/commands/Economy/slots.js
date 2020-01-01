const { Command, util: { shuffle } } = require('../../index');

module.exports = class Slots extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_SLOTS_DESCRIPTION'),
    });
  }

  async run(message, args) {
    const fruits = ['🍎', '🍐', '🍌', '🍇', '🍉', '🍒', '🍓'];

    let i1=0, j1=0, k1=0, i2=1, j2=1, k2=1, i3=2, j3=2, k3=2;

    // Gets three random fruits array
    const colonnes = [
      shuffle(fruits),
      shuffle(fruits),
      shuffle(fruits),
    ];

    // Gets the amount provided
    let amount = args[0];
    if(!amount || isNaN(amount) || amount < 1){
      amount = 1;
    }
    // if(amount > data.memberData.money){
    //   return message.error('economy/slots:NOT_ENOUGH', {
    //     money: amount
    //   });
    // }
    amount = Math.round(amount);

    const tmsg = await message.channel.send(message.language.get('PLEASE_WAIT'));
    editMsg();
    const interval = setInterval(editMsg, 1000);
    setTimeout(() => {
      clearInterval(interval);
      this.end(message, tmsg, fruits, amount, colonnes, i1, j1, k1, i2, j2, k2, i3, j3, k3);
    }, 4000);

    function editMsg() {
      let msg = '[  :slot_machine: | SLOTS ]\n------------------\n';
    
      i1 = (i1 < fruits.length - 1) ? i1 + 1 : 0;
      i2 = (i2 < fruits.length - 1) ? i2 + 1 : 0;
      i3 = (i3 < fruits.length - 1) ? i3 + 1 : 0;
      j1 = (j1 < fruits.length - 1) ? j1 + 1 : 0;
      j2 = (j2 < fruits.length - 1) ? j2 + 1 : 0;
      j3 = (j3 < fruits.length - 1) ? j3 + 1 : 0;
      k1 = (k1 < fruits.length - 1) ? k1 + 1 : 0;
      k2 = (k2 < fruits.length - 1) ? k2 + 1 : 0;
      k3 = (k3 < fruits.length - 1) ? k3 + 1 : 0;
    
      msg += `${colonnes[0][i1]} : ${colonnes[1][j1]} : ${colonnes[2][k1]}\n`;
      msg += `${colonnes[0][i2]} : ${colonnes[1][j2]} : ${colonnes[2][k2]} **<**\n`;
      msg += `${colonnes[0][i3]} : ${colonnes[1][j3]} : ${colonnes[2][k3]}\n------------------\n`;
    
      tmsg.edit(msg);
    }
  }

  async end(message, tmsg, fruits, amount, colonnes, i1, j1, k1, i2, j2, k2, i3, j3, k3) {
    let msg = '[  :slot_machine: | **SLOTS** ]\n------------------\n';
  
    i1 = (i1 < fruits.length - 1) ? i1 + 1 : 0;
    i2 = (i2 < fruits.length - 1) ? i2 + 1 : 0;
    i3 = (i3 < fruits.length - 1) ? i3 + 1 : 0;
    j1 = (j1 < fruits.length - 1) ? j1 + 1 : 0;
    j2 = (j2 < fruits.length - 1) ? j2 + 1 : 0;
    j3 = (j3 < fruits.length - 1) ? j3 + 1 : 0;
    k1 = (k1 < fruits.length - 1) ? k1 + 1 : 0;
    k2 = (k2 < fruits.length - 1) ? k2 + 1 : 0;
    k3 = (k3 < fruits.length - 1) ? k3 + 1 : 0;

    // msg += this.slotMsg[2].replace('{i1}', colonnes[0][i1]).replace('{j1}', colonnes[1][j1]).replace('{k1}', colonnes[2][k1]);

    msg += `${colonnes[0][i1]} : ${colonnes[1][j1]} : ${colonnes[2][k1]}\n`;
    msg += `${colonnes[0][i2]} : ${colonnes[1][j2]} : ${colonnes[2][k2]} **<**\n`;
    msg += `${colonnes[0][i3]} : ${colonnes[1][j3]} : ${colonnes[2][k3]}\n------------------\n`;

    if ((colonnes[0][i2] === colonnes[1][j2]) && (colonnes[1][j2] === colonnes[2][k2])) {
      msg += '| : : :  **JACKPOT**  : : : |';
      tmsg.edit(msg);
      const credits = this.getCredits(amount, true);
      return message.channel.send(`${message.author.username} used ${amount} & won ${credits}`);
    }

    if (colonnes[0][i2] === colonnes[1][j2] || colonnes[1][j2] === colonnes[2][k2] || colonnes[0][i2] === colonnes[2][k2]) {
      msg += '| : : :  **VICTORY**  : : : |';
      tmsg.edit(msg);
      const credits = this.getCredits(amount, false);
      return message.channel.send(`${message.author.username} used ${amount} & won ${credits}`);
    }

    msg += '| : : :  **LOST**  : : : |';
    tmsg.edit(msg);
    return message.channel.send(`${message.author.username} used ${amount} and Lost`);
  }

  getCredits(number, isJackpot) {
    if(!isJackpot){
      number = number*1.5;
    }
    if(isJackpot){
      number = number*4;
    }
    return Math.round(number);
  }
};
