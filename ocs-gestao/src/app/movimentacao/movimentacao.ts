
export interface Movimentacao{
    ID: number,
    IDTipo_Movimentacao: number,
    IDUsuCadastro: number,
    DtCadastro: Date,
    Valor: number,
    Observacoes: string,
    Conferido: boolean,
    IDUsuConferencia: number,
    DtConferencia: Date,
    Excluido: boolean,
    DtExclusao: Date;
    IDUsuExclusao: number,
    NomeTipoMovimentacao:string,
    NomeUsuCadastro: string,
    NomeUsuConferencia:string,
    NomeUsuExclusao: string
}
export interface TotalMovimentacao{
    Tipo: string,
    Total: number
}
export interface listaMovimentacao{
    Movimentacoes: Movimentacao[],
    Totais: TotalMovimentacao[]
}