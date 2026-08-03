import { Fornecedor } from "app/cadastros/fornecedores/fornecedor"
import { FormaPagamento } from "app/cadastros/formaPagamento/forma-pagamento"
import { TipoDocumento } from "app/cadastros/tipoDocumento/tipo-documento"
import { CompraItem } from "./compra-item"


export interface Compra{
    ID : number,
    Data : Date,
    IDFornecedor : number,
    NomeFornecedor: string,
    IDTipo_Documento : number,
    NomeTipoDocumento: string,
    NumDocumento : string,
    DataVencimento : Date,
    DataPagamento : Date,
    IDFormaPagamento : number,
    NomeFormaPagamento: string,
    ValorPago : number,
    Obs : string,
    DtCadastro : Date,
    IDUsuCadastro : number,
    NomeUsuCadastro:string,
    Fornecedor: Fornecedor,
    Forma_Pagamento: FormaPagamento,
    Tipo_Documento: TipoDocumento,
    Itens: CompraItem[]
}

export interface listaCompras{
    Compras: Compra[];
    Total:number;
}