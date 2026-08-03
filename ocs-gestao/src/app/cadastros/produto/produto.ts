export interface Produto{
    //ID, Nome, Descricao, IDUnidade_Medida, CodigoBarras, Valor, DtCadastro, IDUsuCadastro, Ativo
    ID:number,
    Nome:string,
    Descricao:string,
    IDUnidade_Medida: number,
    NomeUnidadeMedida: string,
    CodigoBarras:string,
    Valor:number,
    DtCadastro: Date,
    IDUsuCadastro :number,
    Ativo: any
}