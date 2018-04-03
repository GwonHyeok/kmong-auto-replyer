Vue.http.headers.common["X-CSRF-TOKEN"] = document.querySelector("#_token").getAttribute("value"), inbox_vue = new Vue({
  el: "#inbox_refer",
  data: {
    device: "DESKTOP",
    isMobile: !1,
    isiOSWeb: !1,
    inboxGroupId: 0,
    USERID: "",
    myUsername: "",
    partner: "",
    partnerUsername: "",
    action: "MESSAGE",
    menu_type: "MESSAGE",
    message: "",
    files: [],
    inboxes: [],
    inboxTotalCnt: 0,
    lastMID: "",
    requestGig: { PID: 0, content: "", price: 0, days: 0 },
    myGigs: [],
    isSeller: !1,
    isEndOfPage: !1,
    relatedSubjectId: "",
    pushedMessageIndexes: [],
    canScrollDown: !0,
    bannedKeywordData: [],
    totalBannedKeywordData: [],
    hasKeywords: !1,
    isLoadedMoreMessages: !1,
    availableSendingMessage: !0,
    threeMonthAgo: Math.round(+new Date / 1e3) - 8035200,
    isOnGoingFileupload: !1
  },
  ready: function() {
    $(".messageTextArea").keydown(function(e) {
      (e.ctrlKey || e.metaKey) && 13 == e.which && inbox_vue.message.replace(/^\s+|\s+$/g, "").length > 0 && 1 == inbox_vue.availableSendingMessage && (e.preventDefault(), inbox_vue.sendInboxMessage())
    })
  },
  watch: {
    partnerUsername: function() {
      this.getInboxMessages()
    }, inboxes: function() {
      if ($("#inboxLoading").addClass("hidden"), $("#inboxBodyDiv").removeClass("hidden"), $(".message-left-related-gig, .message-right-related-gig").each(function(e, t) {
        var s = $(t), i = s.height(), a = s.prev().height(), n = 40, o = 30;
        if (i + n < a + o) {
          var r = (a + o - i) / 2 + "px";
          s.css({ "padding-top": r, "padding-bottom": r })
        }
      }), 1 == this.isEndOfPage && 1 == this.isLoadedMoreMessages) {
        this.inboxes.length > 0 && "MESSAGE" == this.inboxes[0].action && $("#inbox_" + this.inboxes[0].MID).attr("style", "padding-top:15px;");
        var e = $("#inbox_" + this.lastMID);
        e.length > 0 && $("body, html").scrollTop(parseInt(e[0].offsetTop)), this.isLoadedMoreMessages = !1
      }
      if (this.inboxes.find(function(e, t) {
        t != inbox_vue.inboxes.length - 1 && (inbox_vue.isMobile ? "REQUEST" == e.action && "MESSAGE" == inbox_vue.inboxes[t + 1].action && $("#inbox_" + e.MID).attr("style", "border-bottom: 1px #DFDFDF solid;margin-bottom:10px;") : "REQUEST" != e.action && "RELATED_GIG" != e.action || "MESSAGE" != inbox_vue.inboxes[t + 1].action || $("#inbox_" + e.MID).attr("style", "border-bottom: 1px #DFDFDF solid;margin-bottom:10px;"))
      }), this.canScrollDown) {
        var t = $("body, html");
        t.scrollTop(t.height()), $("#inboxBodyDiv").scrollTop($(".message-container").height()), this.canScrollDown = !1
      }
      $('[data-toggle="tooltip"]').tooltip({ html: !0 })
    }, message: function() {
      this.message = this.message.replace(/^\s+|\s+$/g, ""), 0 == this.isMobile && this.messageFilter()
    }
  },
  filters: {
    number_format: function(e) {
      if (void 0 !== e) return e.format()
    }, check_length: function(e) {
      return !e.replace(/\s/g, "").length > 0
    }, nl2br: function(e) {
      return e.replace(/\n/g, "<br>")
    }, parsingUrl: function(e) {
      var t = e.split(/\s+/g);
      t = t.unique();
      for (var s in t) {
        if ("string" == typeof t[s] && 1 == urlCheckRegx.test(t[s]) && 1 == urlSecondCheckRegx.test(t[s])) {
          var i = t[s], a = i;
          i.includes("http://") || i.includes("https://") || (a = "http://" + a);
          var n = '<a class="text-underline" href="' + a + '" target="_blank">' + i + "</a>";
          i.indexOf("?") > 0 && (i = i.replace(/\?/g, "\\?"));
          try {
            var o = new RegExp(i, "g");
            e = e.replace(o, n)
          } catch (r) {
          }
        }
        if (s == t.length - 1) break
      }
      return e.trim()
    }
  },
  methods: {
    decodeHtml: function(e) {
      var t = document.createElement("textarea");
      return t.innerHTML = e, t.value
    },
    getInboxMessages: function() {
      var e = { username: this.partnerUsername, isLoadedMoreMessages: this.isLoadedMoreMessages };
      this.$http.get("/inbox/get_inbox_messages", e, null).then(function(e) {
        this.inboxes = e.data.data.inboxes, 0 == this.isLoadedMoreMessages ? (this.USERID = e.data.data.USERID, this.partner = e.data.data.partner, this.myGigs = e.data.data.myGigs, this.inboxGroupId = e.data.data.inboxGroupId, this.inboxTotalCnt = e.data.data.inboxTotalCount, this.inboxes.length > 0 && (this.lastMID = this.inboxes[0].MID)) : this.isEndOfPage = !0, this.setInboxRead()
      }, null)
    },
    getPreviousInbox: function() {
      $(".load-more-messages-button").html('<div class="la-ball-fall color-black"><div></div><div></div><div></div></div>').attr("disabled", "disabled"), this.isLoadedMoreMessages = !0, this.getInboxMessages()
    }, checkInboxRequestNumberFormat: function(e) {
      if (numberOnlyInput(), "days" == e) {
        var t = $(".requestGigDays-min-error");
        t.addClass("hidden"), t.parent().removeClass("has-error");
        var s = this.requestGig.days, i = parseInt(s);
        "" != s && !isNaN(i) && i <= 0 && (this.requestGig.days = 1, t.removeClass("hidden"), t.parent().addClass("has-error"))
      }
      if ("price" == e) {
        var a = $(".requestGigPrice-min-error");
        a.addClass("hidden"), a.parent().removeClass("has-error");
        var n = this.requestGig.price, o = parseInt(n);
        "" != n && !isNaN(o) && o < 5e3 ? (this.requestGig.price = "", a.removeClass("hidden"), a.parent().addClass("has-error")) : this.requestGig.price = 100 * Math.floor(this.requestGig.price / 100)
      }
    }, changeMenuType: function(e) {
      if (this.isMobile) {
        if ("REQUEST" == e && !this.isSeller) return swal({
          title: "판매자 인증",
          text: "결제 요청을 하시려면 먼저 판매자 인증을 하셔야 합니다.",
          type: "warning",
          showCancelButton: !0,
          confirmButtonColor: "#f3865b",
          confirmButtonText: "인증 하기",
          cancelButtonText: "창 닫기",
          closeOnConfirm: !1,
          showLoaderOnConfirm: !0,
          html: !0
        }, function() {
          window.location = "/my_profile/certification"
        }), !1;
        "MESSAGE" != e && $("#" + e + "Div").slideDown("slow"), this.menu_type = e, $("#plus").removeClass("in"), this.isiOSWeb ? $(".message-containergeneralMessageTxtArea").css("margin-bottom", "54px") : $("#inboxBodyDiv").css("bottom", "54px")
      } else if (e) this.menu_type = e; else if (this.menu_type = "MESSAGE" == this.menu_type ? "REQUEST" : "MESSAGE", "REQUEST" == this.menu_type) {
        var t = $("body, html");
        t.animate({ scrollTop: t.height() }, 1e3)
      }
    }, sendInboxMessage: function(e, t, s) {
      if (1 == this.availableSendingMessage) {
        this.availableSendingMessage = !1;
        var i = this.message;
        if ("" == this.message && this.files.length > 0 && (i = "[첨부파일]"), this.isOnGoingFileupload) return sweetalertByType("파일 업로드 중", "파일 업로드 중입니다. 잠시만기다려주세요.", "info", "timer"), !1;
        if ("undefined" == typeof e && "" == i) return sweetalertByType("메시지 오류", "메시지를 반드시 입력해주세요.", "info", "timer"), !1;
        var a = {
          inbox_group_id: this.inboxGroupId,
          MSGTO: this.partner.USERID,
          MSGFROM: this.USERID,
          message: i,
          FID: this.files,
          action: this.action,
          relatedSubjectId: null,
          keywordData: $.unique(this.totalBannedKeywordData),
          hasKeywords: this.hasKeywords,
          partner_username: this.partnerUsername
        };
        if ("REQUEST" == e && (a.action = "REQUEST", a.requestGig = this.requestGig, a.inbox_request = this.requestGig, a.inbox_request.member = { username: this.myUsername }), "CANCEL_REQUEST" == e) {
          if ("undefined" == typeof t) return !1;
          a.action = e, a.message = "결제요청을 철회했습니다.", a.MID = t.MID, a.requestGig = t.inbox_request, a.inbox_request = t.inbox_request, a.inbox_request.member = { username: this.myUsername };
          var n = $(".cancelInboxRequestBtn"), o = n.html();
          n.html('<div class="la-ball-fall color-white"><div></div><div></div><div></div></div>'), n.attr("disabled", "disabled")
        }
        "RELATED_GIG" != this.action && "RELATED_GIG_REQUEST" != this.action && "RELATED_PORTFOLIO" != this.action || (a.relatedSubjectId = this.relatedSubjectId), "CANCEL_REQUEST" != e ? a.vue_inbox_id = this.pushInbox(a, !1) : a.vue_inbox_id = s, this.inboxes[a.vue_inbox_id].unread = -1, this.$http.post("/inbox", a, null).then(function(t) {
          "CANCEL_REQUEST" == e ? (n.html(o), n.removeAttr("disabled"), "object" == typeof this.inboxes[t.data.data.vue_inbox_id] && (this.inboxes[t.data.data.vue_inbox_id].action_status = t.data.data.inbox.action_status, this.inboxes[t.data.data.vue_inbox_id].unread = 1)) : (this.inboxes.$set(t.data.data.vue_inbox_id, t.data.data.inbox), this.message.length > 0 && $("#sendMessageBtn").removeAttr("disabled").removeClass("btn-gray"), "RELATED_GIG_REQUEST" == this.action && (this.action = "MESSAGE")), this.availableSendingMessage = !0
        }, function(e) {
          sweetalert("메시지 전송 실패", e.data.meta.errors, "error"), this.inboxes.splice(this.inboxes.length - 1), this.action = "MESSAGE"
        }), this.initMessage(e)
      }
    }, setInboxRead: function(e) {
      var t = 0;
      if (this.inboxes.find(function(e, s) {
        1 == e.unread && t++
      }), t > 0) {
        var s = {};
        if (s.MSGTO = this.partner.USERID, this.$http.post("/inbox/setRead", s, null).then(function(e) {
          1 == e.data.meta.status && this.updateInboxRead()
        }, null), "NAVBAR" == e) {
          var i = this.pushedMessageIndexes[0], a = $("#inbox_" + this.inboxes[i].MID), n = $("body, html");
          n.scrollTop(a[0].offsetTop - 50), $("#inboxBodyDiv").scrollTop(a[0].offsetTop - 50)
        }
        this.pushedMessageIndexes = []
      }
    }, updateInboxRead: function() {
      this.inboxes.find(function(e, t) {
        e.unread = 0
      })
    }, resetRequest: function(e) {
      0 == this.requestGig[e] && (this.requestGig[e] = "")
    }, pushInbox: function(e, t) {
      t || (this.canScrollDown = !0);
      var s = this.inboxes.push(e) - 1;
      if (t) {
        var i = this.inboxes[s - 1].MID, a = $("#inbox_" + i), n = $(window);
        if (this.isiOSWeb) n[0].pageYOffset < a.height() + a[0].offsetTop - $(window).height() ? this.pushedMessageIndexes.push(s) : (this.setInboxRead(), this.isMobile && (this.canScrollDown = !0)); else {
          var o = $(".message-container"), r = $("#inbox_refer");
          o.height() > r.innerHeight() + o.position().top * -1 + 1 ? this.pushedMessageIndexes.push(s) : (this.setInboxRead(), this.isMobile && (this.canScrollDown = !0))
        }
      }
      return s
    }, initMessage: function(e) {
      if (this.requestGig = {
        PID: 0,
        content: "",
        price: 0,
        days: 0
      }, this.totalBannedKeywordData = [], "sendFile" != e && (this.message = ""), this.files = [], "undefined" != typeof fileAttached) {
        for (var t = 0; t < fileAttached.files.length; t++) $(document).find(fileAttached.files[t].previewElement).remove();
        fileAttached.files = []
      }
      var s = $("#generalMessageTxtArea");
      if (this.isMobile) {
        s.attr("rows", 1), s.removeAttr("style"), s.attr("style", "max-height:68px");
        var i = $("#messageBoxPlus"), a = $("#messageBoxSendBtn");
        i.css("bottom", "0px"), a.css("bottom", "0px"), setTimeout(function() {
          window.scrollTo(0, document.body.scrollHeight)
        }, 500)
      } else {
        var n = $("#inboxRequest");
        n.length > 0 && n.hasClass("in") && n.removeClass("in")
      }
      this.changeMenuType("MESSAGE"), s.trigger("focus"), $("#attached_file").val("")
    }, makeCustomDirectOrder: function(e, t) {
      var s = $(e.target), i = s.html();
      if (s.html('<div class="la-ball-fall color-white"><div></div><div></div><div></div></div>'), s.attr("disabled", "disabled"), null == t.DOID) {
        var a = {
          PID: t.PID,
          inboxRequestId: t.id,
          requestedOption: {
            id: "inbox_request",
            title: t.content,
            description: "",
            price: t.price,
            days: t.days,
            quantity: 1
          }
        };
        this.$http.post("/payments/make_custom_direct_order", a, null).then(function(e) {
          1 == e.data.meta.code ? window.location = e.data.data.url : (sweetalert("오류", e.data.meta.errors, "error"), s.html(i), s.removeAttr("disabled"))
        }, function(e) {
          sweetalert("오류", e.data.meta.errors, "error"), s.html(i), s.removeAttr("disabled")
        })
      } else window.location = "/order/" + t.DOID
    }, messageFilter: function(e) {
      var t = this.getFilteredKeywordData(this.message);
      if (t.length > 0) {
        this.hasKeywords = !0, this.totalBannedKeywordData = this.totalBannedKeywordData.concat(t);
        var s = this.getWarningMessageFromKeywordData(t);
        this.showWarningMessage(s)
      } else this.hasKeywords = !1, this.hideWarningMessage()
    }, getFilteredKeywordData: function(e) {
      var t = [];
      for (var s in this.bannedKeywordData) {
        if ("[0-9]원" == this.bannedKeywordData[s].keyword) {
          var i = e.match(/[0-9]원/g);
          null != i && t.push(this.bannedKeywordData[s])
        } else e.indexOf(this.bannedKeywordData[s].keyword) != -1 && t.push(this.bannedKeywordData[s]);
        if (s == this.bannedKeywordData.length - 1) break
      }
      return t
    }, getWarningMessageFromKeywordData: function(e) {
      var t = [];
      for (var s in e) {
        var i = e[s].message;
        if ($.inArray(i, t) < 0 && t.push(i), s == e.length - 1) break
      }
      return t
    }, hideWarningMessage: function() {
      var e = $("#generalMessageTxtArea");
      $("#keyword_warning").hide().html(""), e.css("background-color", "#FFF"), e.parent().removeClass("has-error")
    }, showWarningMessage: function(e) {
      var t = "", s = $("#generalMessageTxtArea");
      for (var i in e) if (t += '<i class="fa fa-exclamation-triangle"></i>&nbsp;' + e[i] + "<br/>", i == e.length - 1) break;
      $("#keyword_warning").show().html(t), s.css("background-color", "#FFE2E2"), s.parent().addClass("has-error")
    }, deleteUploadedFile: function(e) {
      this.$http.post("/upload", { FID: e, action: "delete" }, null).then(function(e) {
        1 == e.data.meta.status && this.files.find(function(t, s) {
          t.FID == e.data.FID && inbox_vue.files.splice(s, 1)
        })
      }, null)
    }
  }
});
