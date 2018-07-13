var common = {
    //仅用于elementui table组件的colunm列格式化空数据
    isEffective: function (row, column, tablecell) {
        if (tablecell == undefined || tablecell == null || tablecell == '') {
            return "-";
        }
        return tablecell;
    },
    utilsIsEffective: function (tablecell) {
        if (tablecell == undefined || tablecell == null || tablecell == '' || tablecell == 0 || tablecell == '—') {
            return "—";
        }
        return tablecell;
    },
    utilsIsEffectiveBool: function (tablecell) {
        if (tablecell == undefined || tablecell == null || tablecell == '' || tablecell == 0 || tablecell == '—') {
            return false;
        } else {
            return true;
        }

    },
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
};
export default common