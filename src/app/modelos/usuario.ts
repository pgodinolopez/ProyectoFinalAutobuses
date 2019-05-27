export class Usuario {
    id: number;
    _nombre: string;
    _email: string;
    _password: string;
    _telefono: string;
    token: string;
    _token_dispositivo: string;

    constructor(_nombre, _email, _password, _telefono) {
        this._nombre = _nombre;
        this._email = _email;
        this._password = _password;
        this._telefono = _telefono;
    }

}