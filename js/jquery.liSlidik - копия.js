/*
 * jQuery liSlidik v 1.0
 *
 * Copyright 2012, Linnik Yura | LI MASS CODE | http://masscode.ru
 * http://masscode.ru
 * Free to use
 * 
 * October 2012
 */
(function($){
	$.fn.liSlidik = function(params){
		var p = $.extend({
			auto:3000,			//false - чтобы выключить слайд-шоу, или целое число (милисекунды) - чтобы включить и задать время между сменой слайдов
       		duration: 1000		//Число, определяющие, как долго будет протекать анимация смены слайда (в миллисекундах)
		}, params);
		return this.each(function(){
			var 
			slidik = $(this),
			sImg = $('img',slidik),
			sItem = $('li',slidik),
			sItemLength = sItem.length,
			sItemShow = $('.show',slidik),
			sItemShowIndex = sItem.index($(sItemShow)),
			sDotted = $('.dotted[data-slidik='+slidik.attr('id')+']'),
			sCaptionEl = $('.caption[data-slidik='+slidik.attr('id')+']'),
			f1 = true;
			var autoId = function(){},
			sNext = $('.next[data-slidik='+slidik.attr('id')+']'),
			sPrev = $('.prev[data-slidik='+slidik.attr('id')+']'),
			sImgClone = sImg.eq(0).clone().removeAttr('class').removeAttr('width').removeAttr('height').css({left:'-99999px', top:'-99999px',position:'absolute'}).appendTo('body'),
			sImgW = sImgClone.width(),
			sImgH = sImgClone.height(),
			sImgK = sImgW / sImgH;
			sImgClone.remove();
			
			for(i=0;i<sItemLength;i++){
				$('<span>').text(i).addClass('dottedItem').appendTo(sDotted);
			};
			$('.dottedItem',sDotted).on('click',function(){
				if(f1){
					f1 = false;
					$('.dottedItem',sDotted).removeClass('cur').filter($(this)).addClass('cur');
					var dotIndex = $('.dottedItem',sDotted).index($(this));
					sItemShow = $('.show',slidik);
					sItemShow.removeClass('show').fadeOut(p.duration);
					showCaption(dotIndex);
					sItem.eq(dotIndex).addClass('show').fadeIn(p.duration,function(){
						f1 = true;		
					});
				}
				return false;
			});
			var showCaption = function(ind){
				var sCaption = sItem.eq(ind).find('img').attr('alt');
				
				if(sItem.eq(ind).find('img').is('[alt]')){
					if(sItem.eq(ind).find('img').is('[alt*=#]')){
						sCaption = $(sCaption).html();
					}
					sCaptionEl.fadeOut(200,function(){
						$(this).html(sCaption).fadeIn(500)	;
					})
				}else{
					sCaptionEl.fadeOut(200);
				}
			};
			showCaption(sItemShowIndex)
			var slidikSize = function(){
				slidik.css({height:slidik.width() / sImgK});
			};
			slidikSize();
			sItemShow.fadeIn(p.duration);
			$('.dottedItem',sDotted).removeClass('cur').eq(sItemShowIndex).addClass('cur');
			sNext.on('click',function(){
				if(f1){
					f1 = false;
					sItemShow = $('.show',slidik);
					sItemShowIndex = sItem.index($(sItemShow));
					sItemShow.removeClass('show').fadeOut(p.duration);
					
					if(sItemShowIndex < (sItemLength - 1)){
						showCaption(sItemShowIndex + 1);
						$('.dottedItem',sDotted).removeClass('cur').eq(sItemShowIndex + 1).addClass('cur');
						sItem.eq(sItemShowIndex + 1).addClass('show').fadeIn(p.duration,function(){
								f1 = true;		
						});
					}else{
						showCaption(0);
						$('.dottedItem',sDotted).removeClass('cur').eq(0).addClass('cur');
						sItem.eq(0).addClass('show').fadeIn(p.duration,function(){
							f1 = true;	
						});
					}
				}
				return false;
			});
			sPrev.on('click',function(){
				if(f1){
					f1 = false;
					sItemShow = $('.show',slidik);
					sItemShowIndex = sItem.index($(sItemShow));
					sItemShow.removeClass('show').fadeOut(p.duration);
					if(sItemShowIndex > 0){
						showCaption(sItemShowIndex - 1);
						$('.dottedItem',sDotted).removeClass('cur').eq(sItemShowIndex - 1).addClass('cur');
						sItem.eq(sItemShowIndex - 1).addClass('show').fadeIn(p.duration,function(){
								f1 = true;		
						});
					}else{
						showCaption(sItemLength - 1);
						$('.dottedItem',sDotted).removeClass('cur').eq(sItemLength - 1).addClass('cur');
						sItem.eq(sItemLength - 1).addClass('show').fadeIn(p.duration,function(){
							f1 = true;	
						});
					}
				}
				return false;
			});
			var autoFunc = function(){
				if(p.auto){
					autoId = setInterval(function(){
						sNext.trigger('click');
					},p.auto)	
				}
			};
			autoFunc();
			slidik.add(sCaptionEl).on('mouseenter',function(){
				clearTimeout(autoId);	
			}).on('mouseleave',function(){
				clearTimeout(autoId)	;
				autoFunc();
			});
			slidikSize();
			$(window).on('resize',function(){
				slidikSize();
			});
			
		});
	};
})(jQuery);