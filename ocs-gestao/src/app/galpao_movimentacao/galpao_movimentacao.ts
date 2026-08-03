export interface GalpaoMovimentacao{
    //ID, IDGalpao, Data, QtdOvos, QtdRacao, QtdMortes, IDUsuCadastro, DtCadastro

    ID:number,
    IDGalpao:number,
    Galpao:string,
    Data:Date,
    QtdOvos:number,
    QtdRacao:number,
    QtdMortes:number,
    IDUsuCadastro:number,
    UsuCadastro:string,
    DtCadastro:Date
}

export interface TotaisMovimentacoes{
    TotalOvos:number, 
    TotalRacao: number, 
    TotalMortes: number
}

export interface DadosMovimentacao{
    movimentacoes: GalpaoMovimentacao[],
    totais: TotaisMovimentacoes
}