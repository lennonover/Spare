/**
 * [Author] 王艳磊
 * [Data] 2016-11-18
 * [description]
 * @param  {[type]} ){	var spare_mx,spare_my,spare_mpagex,spare_mpagey,toggleSpare,show_per_page,number_of_pages,number_of_items,incal [description]
 * @return {[type]}         [description]
 */
$(function(){
	var spare_mx,spare_my,spare_mpagex,spare_mpagey,toggleSpare,show_per_page,number_of_pages,number_of_items,incal = false;
	// 用户偏好配置项
	var options ={
		toggle:true
	};
	var tpl={
		successTpl:[
		"<div class=spareWindow>",
		'<div class=spare-content>{{content}}</div>',
		'<div class=spare-pronunciation><span class=pronunciation-uk >英<i><audio src={{uk_audio}}></audio></i>[{{pronunciationUK}}]</span><span class=pronunciation-us >美<i><audio src={{us_audio}}></audio></i>[{{pronunciation}}]</span></div>',
		'<div>{{#definition}}</div>',
		'</div>'
		].join(""),
		errorTpl:[
		"<div class=spareWindow>",
		'<div class=spare-content>{{msg}}</div>',
		'</div>'
		].join("")
	}
	var app={
		init:function(){
			var that=this;
			that.removeDom();
			that.addEventOn();
			that.resolution();
			that.addEventOnPage();
			toggleSpare =function(){
				that.translate();
			}
			window.document.body.addEventListener("mouseup", toggleSpare, false);
			window.document.body.addEventListener("keyup", that.toggleOC.bind(that), false);
			$(window).resize(function() {that.resolution()});
		},
		// 去除卫报除正文外多余内容
		removeDom:function(){
			var sel_class=[
				// 头部
				'navigation-container',
				// 左边标志、时间
				'content__labels--not-immersive',
				'content__labels--not-immersive',
				'element-rich-link',
				'content__meta-containe',
				'tone-news--item',
				'js-football-meta',
				// 右边列表
				'element-rich-link',
				'js-components-container',
				// 中间
				'contributions__epic',
				'submeta',
				// footer部分
				'site-message--membership-prominent.purple',
				'content-footer',
				'l-footer'
			]
	        for (var i = sel_class.length - 1; i >= 0; i--) {
	        	$('.' + sel_class[i]).remove();
	        };
	        setInterval(function(){
	        	// 推送广告
	        	$(".selection-sharing.selection-sharing--active").remove()
	        	$(".site-message--membership-prominent").remove()
	        	$('.element').remove();
	        }, 1000)
		},
		// 获取选中对象
		translate:function(e){
			var e = e || window.event;
			var spare_selobj = document.getSelection();
			if (spare_selobj.anchorNode && spare_selobj.anchorNode.nodeType == 3) {
				var selWord = spare_selobj.toString();
				if (selWord == "") {
				  return;
				}
				selWord = selWord.replace('-\n','');
				selWord = selWord.replace('\n', ' ');
				spare_mx = e.clientX;
				spare_my = e.clientY;
				spare_mpagex =e.pageX;
				spare_mpagey =e.pageY;
				this.showTran(selWord);
			}
		},
		// 发送请求
		showTran:function(content) {
			var that =this;
		    var urlS='https://api.shanbay.com/bdc/search/?word='+content+'';
		    $.ajax({
		    	type : "GET",
		        url : urlS, 
		    })
		    .done(function(result) {
	        	$(".spareWindow").remove();
	        	if(result.status_code === 0){
	        		that.showDialog(result.data,tpl.successTpl)
	        	}else{
	        		that.showDialog(result,tpl.errorTpl)
	        	}
	        })
		    .fail(function() {
		    	console.log("请求失败");
		    })
		    .always(function() {
		    	
		    });
		},
		// 显示翻译
		showDialog:function(data,tpl){
			if(data.definition !== undefined){
				var definitionVal=data.definition
				var regRN = /\n|\r\n|\r/g;
				definitionVal = definitionVal.replace(regRN,"<br>");
				data.definition=definitionVal;
				data.pronunciationUK = data.pronunciations.uk;
			}
			var str= Wltpl(tpl, data);
			$('body').append(str);
			var imgUrl= "url("+chrome.extension.getURL('imgs/pron.png')+")";
			$('.spare-pronunciation i').css("background-image",imgUrl);
			var spare_height=$(".spareWindow").height();
			var spare_width=$(".spareWindow").width();
			if(spare_my < spare_height+10){
				if(spare_mx < spare_width/2){
					$(".spareWindow").animate({
				        left : 5,
				        top : spare_mpagey + 20,
				        opacity : "show"
				    }, 10);
				}else if($(window).width() - spare_mx < spare_width){
					$(".spareWindow").animate({
				        left : $(window).width()-spare_width - 30,
				        top : spare_mpagey + 20,
				        opacity : "show"
				    }, 10);
				}else{
					$(".spareWindow").animate({
				        left : spare_mpagex + 8,
				        top : spare_mpagey + 8,
				        opacity : "show"
				    }, 10);
				}
			}else{
			    if(spare_mx < spare_width/2){
					$(".spareWindow").animate({
				        left : 5,
				        top : spare_mpagey - spare_height -30,
				        opacity : "show"
				    }, 10);
				}else if($(window).width() - spare_mx < spare_width){
					$(".spareWindow").animate({
				        left : $(window).width()-spare_width - 30,
				        top : spare_mpagey - spare_height -30,
				        opacity : "show"
				    }, 10);
				}else{
					$(".spareWindow").animate({
				        left : spare_mpagex,
				        top : spare_mpagey - spare_height -30,
				        opacity : "show"
				    }, 10);
				}
			}

		},
		// 添加发音事件
		addEventOn:function(){
		    $(document).on('click', 'body', function(event) {
		    	incal ? (incal = false) : $(".spareWindow").remove();
		    });
		    $(document).on('click', '.spareWindow', function(event) {
		    	incal = true;
		    });
			$(document).on('mouseenter', '.spare-pronunciation i', function(event) {
				var $this = $(this),
		        $audio = $this.find("audio");
		    	$audio.get(0).play();
			});
		},
		// 切换翻译
		toggleOC:function (e) {
		  if (e.which == 81 && e.altKey && e.ctrlKey) {
		    if (options.toggle) {
		      window.document.body.removeEventListener("mouseup", toggleSpare, false);
		      options.toggle = false;
			  console.log("已关闭取词")
		    } else {
		      window.document.body.addEventListener("mouseup", toggleSpare, false);
		      options.toggle = true;
			  console.log("已打开取词")
		    }
		  }
		},
		// 初始化用户设置 本版本暂没启用storage
		inittoggleOC:function(callback){
			// 从 storage 中读取配置，如果没有配置，则初始化为默认值
			chrome.storage.sync.get(null, function(data) {
				$.extend(options, data);
				chrome.storage.sync.set(options, function(data) {
					console.log("初始化完成")
				})
				callback && callback();
			});
		},
		// 监听配置项
		eventOptions:function(changes) {
			for (var name in changes) {
				var change = changes[name];
				options[name] = change.newValue;
			}
		},
		// 分页
		pagingFun:function(){
			number_of_items = $('.content__article-body').children().size();
			number_of_pages = Math.ceil(number_of_items/show_per_page);
			var navigation_html = ['<div class="space-paging"><a class="previous-link" href="javascript:;">Prev</a>'];
			var current_link = 0;
			while(number_of_pages > current_link){
				navigation_html.push('<a class="page-link" href="javascript:;" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>');
				current_link++;
			}
			navigation_html.push('<a class="next-link" href="javascript:;">Next</a></div>');
			$(".space-paging") && $(".space-paging").remove();
			$('.after-article').before(navigation_html.join(""));
			$('.space-paging .page-link:first').addClass('active-page');
			$('.content__article-body').children().css('display', 'none');
			$('.content__article-body').children().slice(0, show_per_page).css('display', 'block');	
			$(".previous-link").addClass('active-preNext')
		},
		// 页跳转
		goPage:function(page_num){
			switch (page_num) {
				case 0:
					$(".previous-link").addClass('active-preNext')
					$(".next-link").removeClass('active-preNext')
					$(".content__head").show();
					$(".media-primary").show();
					break;
				case number_of_pages -1:
					$(".previous-link").removeClass('active-preNext')
					$(".next-link").addClass('active-preNext')
					$(".content__head").hide();
					$(".media-primary").hide();
					break;
				default:
					$(".previous-link").removeClass('active-preNext')
					$(".next-link").removeClass('active-preNext')
					$(".content__head").hide();
					$(".media-primary").hide();
					break;
			}
			start_from = page_num * show_per_page;
			end_on = start_from + show_per_page;
			$('.content__article-body').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
			$('.page-link[longdesc=' + page_num +']').addClass('active-page').siblings('.active-page').removeClass('active-page');
		},
		// 分页添加事件
		addEventOnPage:function(){
			var that=this;
			var new_page;
			$(document).on('click', '.space-paging a', function(event) {
				var $this = $(this);
				switch (true) {
					case $this.attr('class') == "next-link":
						new_page = Number($(".active-page").attr("longdesc")) + 1;
						if($('.active-page').next('.page-link').length==true){
							that.goPage(new_page);
						}
						break;
					case $this.attr('class') == "previous-link":
						new_page = Number($(".active-page").attr("longdesc")) - 1;
						if($('.active-page').prev('.page-link').length==true){
							that.goPage(new_page);
						}
						break;
					case $this.attr('class') == "page-link":
						new_page =Number($this.attr("longdesc"))
						that.goPage(new_page);
						break;
				}
			})	
		},
		resolution:function(){
			var that = this;
			switch (true) {
				case screen.height <= 480:
					show_per_page = 4;
					that.pagingFun();
					break;
				case screen.height <= 763:
					show_per_page = 6;
					that.pagingFun();
					break;
				case screen.height <= 1024:
					show_per_page = 8;
					that.pagingFun();
					break;
				default:
					show_per_page = number_of_items;
					that.pagingFun();
					$(".space-paging") && $(".space-paging").remove();
					break;

			}
		}
	}
	app.init()
})