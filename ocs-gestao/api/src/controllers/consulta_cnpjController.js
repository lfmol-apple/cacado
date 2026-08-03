import ConsultaCnpj from "../models/consulta_cnpj.js";
import request from "request"
class ConsultaCnpjController{
    static consulta(req,res){
        const cnpj = req.params.cnpj;
        request.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`,(error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            res.status(200).json(JSON.parse(body));
//            return body;
        });
    }
}
export default ConsultaCnpjController;