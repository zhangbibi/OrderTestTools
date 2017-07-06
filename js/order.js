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
        initEffectiveDate();
        initApplyInfo();
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

    function initEffectiveDate() {
        var now = new Date();
        var tomorrow = new Date();
        tomorrow.setTime(now.getTime() + 24 * 60 * 60 * 1000);
        var month = tomorrow.getMonth() + 1;
        var day = tomorrow.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var tomorrowStr = tomorrow.getFullYear() + "-" + month + "-" + day;
        $("#effectiveDate").val(tomorrowStr);
    }

    function initApplyInfo() {
        var birthady = new Date("1980/01/01");
        var month = birthady.getMonth() + 1;
        var day = birthady.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var appBirthday = birthady.getFullYear() + "-" + month + "-" + day;
        $("#appBirthday").val(appBirthday);
        $("#appPhoneNo").val("13888888888");

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
            var isValidate = validateParams();
            if (!isValidate) {
                $("#tips").show();
                return;
            }
            var data = {
                "baseInfo": {
                    "env": $("#env").val(),
                    "salesChannel": $("#salesChannel").val(),
                    "salesSource": $("#salesSource").val(),
                    "effectiveDate": $("#effectiveDate").val()
                },
                "appInfo": {
                    "appName": $("#appName").val(),
                    "appBirthday": $("#appBirthday").val(),
                    "appSex": $("#appSex").val(),
                    "appIDNo": $("#appIDNo").val(),
                    "appPhoneNo": $("#appPhoneNo").val()
                },
                "insInfo": {
                    "relationToApp": $("#relationToApp").val(),
                    "insName": $("#insName").val(),
                    "insBirthday": $("#insBirthday").val(),
                    "insSex": $("#insSex").val(),
                    "insIDNo": $("#insIDNo").val(),
                    "insPhoneNo": $("#insPhoneNo").val()
                },
                "productInfo": {
                    "product": $("#product").val()
                },
                "benefitInfo": {
                    "beneficiaryType": $("#beneficiaryType").val(),
                    "relationToIns": $("#relationToIns").val(),
                    "benefitType": $("#benefitType").val(),
                    "benefitName": $("#benefitName").val(),
                    "benefitBirthday": $("#benefitBirthday").val(),
                    "benefitSex": $("#benefitSex").val(),
                    "benefitIDNo": $("#benefitIDNo").val()
                }
            };
            var options = {
                'url': '/order/mock/order/send.mock',
            }
            var callback = function (data) {
                renderResultAfterSendOrder(data);
            }
            request.post(data, callback, options);
        });
    }

    function renderResultAfterSendOrder(data) {
        $("#orderResult").show();
        clearResult();
        if (data.rt_code == 400000) {
            $("#result_status").html("失败");
            $("#result_orderNo").html(data.data);
            $("#result_errMsg").html(data.rt_msg);
        } else if (data.rt_code == 0) {
            $("#result_status").html("请求中,稍等...");
            $("#result_orderNo").html(data.data);
            showProgressAfterSendOrder(data.data);
        }
    }

    function showProgressAfterSendOrder(orderNo) {
        var html = ['<div id="progress_mask" style="position: fixed;z-index: 1;width: 100%;height: 100%;top: 0;left: 0;background: rgba(16, 16, 16, 0.69);"><div>',
            '<div style="position: fixed;z-index: 13;width: 60%;top: 50%;left: 50%;transform: translate(-50%, -50%);text-align: center;border-radius: 5px;" class="loading_box" id="progress_dialog">',
            '<div style="height: 40px;color: white;font-size: larger;">投保中,请勿关闭页面,耐心等耐...</div>',
            '<div class="progress progress-striped active">',
            '<div id="progressDIV" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div>'
        ].join('');
        removeProgress();
        $(document.body).append(html);
        var pregressWidth = 0;
        global.intv = setInterval(function () {
            pregressWidth += 0.5;
            $("#progressDIV").css("width", pregressWidth + "%");
            if (pregressWidth >= 100) {
                queryPolicyStatus(orderNo);
            }
        }, 100);
    }

    function queryPolicyStatus(orderNo) {
        clearInterval(global.intv);
        removeProgress();
        var data = {
            "env": $("#env").val(),
            "orderNo": orderNo
        };
        var options = {
            'url': '/order/mock/order/query.mock',
        }
        var callback = function (data) {
            if (data.rt_code == 0 && data.data.policy_status == "1" && data.data.policy_no) {
                $("#result_status").html("成功");
                $("#result_policyNo").html(data.data.policy_no);
                $("#result_product_code").html($("#product").val());
                $("#result_effective_time").html(data.data.effective_date);
            } else {
                $("#result_status").html("失败");
                $("#result_errMsg").html(data.data.err_msg);
            }
        }
        request.post(data, callback, options);
    }

    function removeProgress() {
        $("#progress_mask").remove();
        $("#progress_dialog").remove();
    }

    function clearResult() {
        $("#result_status").html("");
        $("#result_orderNo").html("");
        $("#result_policyNo").html("");
        $("#result_errMsg").html("");
        $("#result_effective_time").html("");
        $("#result_product_code").html("");
    }

    function validateParams() {
        $("#tips").hide();
        $("#orderResult").hide();
        $(".has-error").removeClass("has-error");
        var isValidate = true;
        var notBlankInputArr = $("[validate-blank]");
        console.log(notBlankInputArr.length);
        for (var i = 0; i < notBlankInputArr.length; i++) {
            var $input = $(notBlankInputArr[i]);
            if (!$input.val()) {
                $input.parent().parent().addClass("has-error");
                isValidate = false;
            }
        }
        return isValidate;
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
            $("#benefitName").val("法定");
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