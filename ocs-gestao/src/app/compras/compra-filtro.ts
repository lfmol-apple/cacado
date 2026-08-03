export interface CompraFiltro{
    PeriodoDe:Date,
    PeriodoAte:Date,
    IDFornecedor: number,
    IDTipo_Documento: number,
    NumDocumento:string,
    PeriodoDeVencimento:Date,
    PeriodoAteVencimento:Date,
    PeriodoDePagamento:Date,
    PeriodoAtePagamento:Date,
    StatusPagamento:string,
    IDFormaPagamento: number,
    IDUsuCadastro:number,
}