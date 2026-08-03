import request from "request";

class ConsultaCnpj{
    
    static consulta(cnpj){
        request.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`,(error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            return body;
        });
    }

}

export default ConsultaCnpj;