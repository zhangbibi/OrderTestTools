/**
 * Created by zhangyaping on 2017/6/28.
 */
$(function () {
    global.initPage = function () {
        initChannel(global.configJSON.channelKey, global.configJSON.channelJSON);
        initSource(global.configJSON.sourceKey, global.configJSON.sourceJSON);
        initProduct(global.configJSON.productCode, global.configJSON.productJSON);
        initInsuredRelation(global.configJSON.insuredRelationKey, global.configJSON.insuredRelationJSON);
        initBenefitRelationToIns(global.configJSON.insuredRelationKey, global.configJSON.insuredRelationJSON);
        initBenefitType(global.configJSON.benefitTypeKey, global.configJSON.benefitTypeJSON);
        //绑定页面事件
        bindEvent();
    }
    function initChannel(channelkey, channelJSON) {
        var optionHTML = getOptionHTML(channelkey, channelJSON);
        $("#salesChannel").html(optionHTML);
    }

    function initSource(sourceKey, sourceJSON) {
        var optionHTML = getOptionHTML(sourceKey, sourceJSON);
        $("#salesSource").html(optionHTML);
    }

    function initProduct(productCode, productJSON) {
        var optionHTML = getOptionHTML(productCode, productJSON);
        $("#product").html(optionHTML);
    }

    function initInsuredRelation(insuredRelationKey, insuredRelationJSON) {
        var optionHTML = getOptionHTML(insuredRelationKey, insuredRelationJSON);
        $("#relationToApp").html(optionHTML);
    }

    function initBenefitRelationToIns(relationKey, relationJSON) {
        var optionHTML = getOptionHTML(relationKey, relationJSON);
        $("#relationToIns").html(optionHTML);
    }

    function initBenefitType(benefitTypeKey, benefitTypeJSON) {
        var optionHTML = getOptionHTML(benefitTypeKey, benefitTypeJSON);
        $("#benefitType").html(optionHTML);
    }


    function getOptionHTML(keyArray, valueJSON) {
        var optionHTML = "";
        for (var i = 0; i < keyArray.length; i++) {
            optionHTML += '<option value ="' + keyArray[i] + '">' + valueJSON[keyArray[i]] + '</option>';
        }
        return optionHTML;
    }

    function bindEvent() {
        //随机生成投保人身份证
        $("#genApplyIDNO").bind("click", function (e) {
            var appBirthday = $("#appBirthday").val();
            var appSex = $("#appSex").val();
            if (!appBirthday) {
                alert("投保人生日不可为空");
                return;
            }
            console.log(appBirthday + " " + appSex);
            var id = $.generateRandomID(appSex, appBirthday);
            $("#appIDNo").val(id);
        });
        //随机生成被保人身份证
        $("#genInsIDNO").bind("click", function (e) {
            var insBirthday = $("#insBirthday").val();
            var insSex = $("#insSex").val();
            if (!insBirthday) {
                alert("被保人生日不可为空");
                return;
            }
            console.log(insBirthday + " " + insSex);
            var id = $.generateRandomID(insSex, insBirthday);
            $("#insIDNo").val(id);
        });
        //随机生成受益人身份证
        $("#genBenefitIDNO").bind("click", function (e) {
            var benefitBirthday = $("#benefitBirthday").val();
            var benefitSex = $("#benefitSex").val();
            if (!benefitBirthday) {
                alert("受益人生日不可为空");
                return;
            }
            console.log(benefitBirthday + " " + benefitSex);
            var id = $.generateRandomID(benefitSex, benefitBirthday);
            $("#benefitIDNo").val(id);
        });
        //选择投被保人关系
        $("#relationToApp").bind("change", function (e) {
            var selectVal = $("#relationToApp").val();
            if (selectVal && selectVal == "00") {
                renderInsInfo(true);
            } else {
                renderInsInfo(false);
            }
        });
        //选择受益人类型
        $("#beneficiaryType").bind("change", function (e) {
            var selectVal = $("#beneficiaryType").val();
            if (selectVal && selectVal == "00") {
                renderBenefitInfo(true);
            } else {
                renderBenefitInfo(false);
            }
        });
        //选择受益人与被保人类型
        $("#relationToIns").bind("change", function (e) {
            var selectVal = $("#relationToIns").val();
            if (selectVal && selectVal == "00") {
                renderBenefitInfoWhenChoiceRelation(true);
            } else {
                renderBenefitInfoWhenChoiceRelation(false);
            }
        });
        //生成订单
        $("#sendOrder").bind("click", function (e) {
            var data = {
                "xxx" : "HelloWorld"
            }
            var options = {
                'url' : '/order/mock/order/send.mock',
            }
            var callback = function(data) {
                console.log(data);
            }
            request.post(data, callback, options);
        });
    }

    function renderBenefitInfoWhenChoiceRelation(isIns) {
        if (isIns) {
            var insName = $("#insName").val();
            var insBirthday = $("#insBirthday").val();
            var insSex = $("#insSex").val();
            var insIDNo = $("#insIDNo").val();
            if (insName && insBirthday && insSex && insIDNo) {
                $("#benefitName").val(insName);
                $("#benefitBirthday").val(insBirthday);
                $("#benefitSex").val(insSex);
                $("#benefitIDNo").val(insIDNo);

                $("#benefitType").val("0");
                $("#beneficiaryType").val("01");
                setDisabledAttr("set", [$("#benefitType"), $("#benefitName"), $("#benefitBirthday"), $("#benefitSex"), $("#benefitIDNo"), $("#genBenefitIDNO")]);
            } else {
                $("#relationToIns").val("");
                alert("请完善被保人信息");
            }
        } else {
            setDisabledAttr("remove", [$("#relationToIns"), $("#benefitType"), $("#benefitName"), $("#benefitBirthday"), $("#benefitSex"), $("#benefitIDNo"), $("#genBenefitIDNO")]);
        }
    }

    function renderBenefitInfo(isLow) {
        if (!isLow) {
            setDisabledAttr("remove", [$("#relationToIns"), $("#benefitType"), $("#benefitName"), $("#benefitBirthday"), $("#benefitSex"), $("#benefitIDNo"), $("#genBenefitIDNO")]);
        } else {
            setValueBlank([$("#relationToIns"), $("#benefitType"), $("#benefitName"), $("#benefitBirthday"), $("#benefitSex"), $("#benefitIDNo")]);
            setDisabledAttr("set", [$("#relationToIns"), $("#benefitType"), $("#benefitName"), $("#benefitBirthday"), $("#benefitSex"), $("#benefitIDNo"), $("#genBenefitIDNO")]);
        }
    }

    function renderInsInfo(isApp) {
        if (isApp) {
            var appName = $("#appName").val();
            var appBirthday = $("#appBirthday").val();
            var appSex = $("#appSex").val();
            var appIDNo = $("#appIDNo").val();
            var appPhoneNo = $("#appPhoneNo").val();
            if (appName && appBirthday && appSex && appIDNo && appPhoneNo) {
                $("#insName").val(appName);
                $("#insBirthday").val(appBirthday);
                $("#insSex").val(appSex);
                $("#insIDNo").val(appIDNo);
                $("#insPhoneNo").val(appPhoneNo);
                setDisabledAttr("set", [$("#insName"), $("#insBirthday"), $("#insSex"), $("#insIDNo"), $("#genInsIDNO"), $("#insPhoneNo")]);
            } else {
                $("#relationToApp").val("");
                alert("请完善投保人信息");
            }
        } else {
            setValueBlank([$("#insName"), $("#insBirthday"), $("#insSex"), $("#insIDNo"), $("#insPhoneNo")]);
            setDisabledAttr("remove", [$("#insName"), $("#insBirthday"), $("#insSex"), $("#insIDNo"), $("#genInsIDNO"), $("#insPhoneNo")]);
        }
    }

    function setDisabledAttr(type, elementArray) {
        if (type == "set") {
            for (var i = 0; i < elementArray.length; i++) {
                elementArray[i].attr("disabled", "disabled");
            }
        } else if (type == "remove") {
            for (var i = 0; i < elementArray.length; i++) {
                elementArray[i].removeAttr("disabled");
            }
        }
    }

    function setValueBlank(elementArray) {
        for (var i = 0; i < elementArray.length; i++) {
            elementArray[i].val("");
        }
    }

    global.initPage();
});