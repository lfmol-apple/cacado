export interface VendaFiltro{
    PeriodoDe:Date,
    PeriodoAte:Date,
    IDCliente: number,
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