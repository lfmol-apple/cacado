//ID, IDCompra, IDInsumo, Quantidade, ValorUnitario
export interface CompraItem{
    ID : number,
    IDCompra : number,
    IDInsumo : number,
    NomeInsumo: string,
    SiglaUnidadeMedida:string,
    Quantidade : number,
    ValorUnitario : number,
    ValorTotal: any    
}