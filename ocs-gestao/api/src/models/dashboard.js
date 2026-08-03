import db from "../config/dbConnect.js";

class Dashboard{

    static async vendaMes(){
         
        var [rows] = await db.query(`select 
                                        day(v.selected_date)
                                        Dia,COUNT(venda.ID) Quantidade from 
                                    (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
                                        left join venda on venda.Data = v.selected_date
                                    where selected_date between DATE(date_add(now(),interval -DAY(now())+1 DAY)) and DATE(LAST_DAY(now()))
                                    group by day(v.selected_date)
                                    order by day(v.selected_date)
                                    `)

            const labels = rows.map(x => x.Dia);
            const series = [rows.map(x => x.Quantidade)];
            return {
                labels,
                series
            }       
    }

    static async vendasSemana(){
        
        var [rows] = await db.query(`select 
                                    CASE
                                        WHEN dayofweek(v.selected_date) = 1 THEN 'D'
                                        WHEN dayofweek(v.selected_date) = 2 THEN 'S'
                                        WHEN dayofweek(v.selected_date) = 3 THEN 'T'
                                        WHEN dayofweek(v.selected_date) = 4 THEN 'Q'
                                        WHEN dayofweek(v.selected_date) = 5 THEN 'Q'
                                        WHEN dayofweek(v.selected_date) = 6 THEN 'S'
                                        WHEN dayofweek(v.selected_date) = 7 THEN 'S'
                                    END
                                    Dia,COUNT(venda.ID) Quantidade from 
                                    (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
                                    left join venda on venda.Data = v.selected_date
                                    where selected_date between DATE(DATE_ADD(NOW(), INTERVAL(-WEEKDAY(NOW())) DAY)) and DATE(DATE(NOW() + INTERVAL (6 - WEEKDAY(NOW())) DAY))
                                    GROUP BY dayofweek(v.selected_date)
                                    ORDER BY dayofweek(v.selected_date)`)

            const labels = rows.map(x => x.Dia);
            const series = [rows.map(x => x.Quantidade)];
            return {
                labels,
                series
            }
            
    }

    static async ComprasSemana(){
        
        var [rows] = await db.query(`select 
                                    CASE
                                        WHEN dayofweek(v.selected_date) = 1 THEN 'D'
                                        WHEN dayofweek(v.selected_date) = 2 THEN 'S'
                                        WHEN dayofweek(v.selected_date) = 3 THEN 'T'
                                        WHEN dayofweek(v.selected_date) = 4 THEN 'Q'
                                        WHEN dayofweek(v.selected_date) = 5 THEN 'Q'
                                        WHEN dayofweek(v.selected_date) = 6 THEN 'S'
                                        WHEN dayofweek(v.selected_date) = 7 THEN 'S'
                                    END
                                    Dia,COUNT(compra.ID) Quantidade from 
                                    (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
                                    (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
                                    left join compra on compra.Data = v.selected_date
                                    where selected_date between DATE(DATE_ADD(NOW(), INTERVAL(-WEEKDAY(NOW())) DAY)) and DATE(DATE(NOW() + INTERVAL (6 - WEEKDAY(NOW())) DAY))
                                    GROUP BY dayofweek(v.selected_date)
                                    ORDER BY dayofweek(v.selected_date)`)

            const labels = rows.map(x => x.Dia);
            const series = [rows.map(x => x.Quantidade)];
            return {
                labels,
                series
            }
            
    }



    static async vendasMesAtual(){
        var [rows] = await db.query(`SELECT 
                                        COUNT(*) Numvendas,
                                        SUM(ValorPago) Valorvendas  
                                    FROM 
                                        venda 
                                    WHERE month(venda.DATA) = MONTH(NOW()) AND year(venda.DATA) = year(NOW()) `)
        return rows[0];
    }

    static async comprasMesAtual(){
        var [rows] = await db.query(`SELECT 
                                        COUNT(*) NumCompras,
                                        SUM(ValorPago) ValorCompras  
                                    FROM 
                                        compra 
                                    WHERE month(compra.DATA) = MONTH(NOW()) AND year(compra.DATA) = year(NOW()) ;`)
        return rows[0];
    }

    static async ProducaoOvosDiaDia(){
        var [rows] = await db.query(`select 
                                        day(v.selected_date)
                                        Dia,case when SUM(QtdOvos) > 0 then SUM(QtdOvos) else 0 end Quantidade from 
                                    (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
                                        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
                                        left join galpao_movimentacao on galpao_movimentacao.Data = v.selected_date
                                    where selected_date between DATE(date_add(now(),interval -DAY(now())+1 DAY)) and DATE(LAST_DAY(now()))
                                    group by day(v.selected_date)
                                    order by day(v.selected_date)`)

        const labels = rows.map(x => x.Dia);
        const series = [rows.map(x => x.Quantidade)];
        return {
            labels,
            series
        }

    }

    static async getDashboard(){
        const GraficovendasSemana = await Dashboard.vendasSemana();
        const GraficoComprasSemana = await Dashboard.ComprasSemana();
        const GraficovendasMes = await Dashboard.vendaMes();
        const vendasMesAtual = await Dashboard.vendasMesAtual();
        const ComprasMesAtual = await Dashboard.comprasMesAtual();
        const GraficoOvosMes = await Dashboard.ProducaoOvosDiaDia()
        return {
            GraficovendasMes,
            GraficoComprasSemana,
            GraficovendasSemana,
            vendasMesAtual,
            ComprasMesAtual,
            GraficoOvosMes            
        }
    }

}

export default Dashboard