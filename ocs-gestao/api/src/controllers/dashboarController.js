import Dashboard from "../models/dashboard.js";

class DashboardController{
    static GetDashboard(req,res) {
        Dashboard.getDashboard()
        .then(dashboard =>{
            res.status(200).json(dashboard);
        })
    }
}

export default DashboardController