export class User {
    private _mail: string;
    get mail() {
        return this._mail;
    }
    set mail(value) {
        this._mail = value;
    }

    private _displayName: string;
    get displayName() {
        return this._displayName;
    }
    set displayName(value) {
        this._displayName = value;
    }

    private _givenName: string;
    get givenName() {
        return this._givenName;
    }
    set givenName(value) {
        this._givenName = value;
    }

    private _surname: string;
    get surname() {
        return this._surname;
    }
    set surname(value) {
        this._surname = value;
    }

    private _jobTitle: string;
    get jobTitle() {
        return this._jobTitle;
    }
    set jobTitle(value) {
        this._jobTitle = value;
    }
}
