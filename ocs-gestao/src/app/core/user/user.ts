export interface User{
    ID: number;
    Nome: string;
    Email: string
    DtNascimento: Date;
    Senha: string
    Bio: string
    Ativo: boolean;
    EmailConfirmado: boolean;
    DtCadastro: Date;
}