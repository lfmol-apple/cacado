//ID, Data, IDCliente, IDTipo_Documento, NumDocumento, DataVencimento, DataPagamento, IDForma_Pagamento, TipoDesconto, Desconto, ValorPago, Obs, DtCadastro, IDUsuCadastro
import { Cliente } from "app/cadastros/cliente/cliente"
import { FormaPagamento } from "app/cadastros/formaPagamento/forma-pagamento"
import { TipoDocumento } from "app/cadastros/tipoDocumento/tipo-documento"
import { VendaItem } from "./venda-item"

export interface Venda{
    ID : number,
    Data : Date,
    IDCliente : number,
    NomeCliente: string,
    IDTipo_Documento : number,
    NomeTipoDocumento: string,
    NumDocumento : string,
    DataVencimento : Date,
    DataPagamento : Date,
    IDForma_Pagamento : number,
    NomeFormaPagamento: string,
    TipoDesconto : string,
    Desconto : number,
    ValorPago : number,
    Obs : string,
    DtCadastro : Date,
    IDUsuCadastro : number,
    NomeUsuCadastro:string,
    Cliente: Cliente,
    Forma_Pagamento: FormaPagamento,
    Tipo_Documento: TipoDocumento,
    Itens: VendaItem[]
}

export interface listaVendas{
    Vendas: Venda[];
    Total:number;
}