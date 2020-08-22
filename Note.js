export default class Note {
  constructor(config) {
    this.value = config.value || '';
    this.dateCreated = new Date();
    this.id = `note-${this.dateCreated.getTime()}`;
  }

  get timeCreated() {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${day}-${month}-${year}`;
  }

};
