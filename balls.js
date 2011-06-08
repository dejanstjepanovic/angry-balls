/*!
 * If someone is interested in this and saw that comments are missing.. 
 * sorry about that. I had no time.
 * I hope you can understand the code.. it seems that it is not difficult. :)
 * And.. javascript is not my primary programing language. :)
 *
 * Copyright 2011, Dejan Stjepanovic <stj.dejan@gmail.com>
 */
$(document).ready(function(){
	var timer,run,balls,mainWinCfg,ballCfg,greenBall,gameControl,speed,level,score,mouse;
	/* MAIN WINDOW */
	mainWin = document.getElementById('main-window');
	mainWin.w = $(mainWin).outerWidth(true);
	mainWin.h = $(mainWin).outerHeight(true);
	/* SCORE */
	score = document.getElementById('score');
	score.pps = document.getElementById('score-pps');
	score.pps._v = 0;
	score._t = 0;
	score._v = 0;
	score.refresh = function(t){
		t = t - score._t;
		v = speed.getValue()*Math.exp(balls.length/2)*(t/100)*0.0002;
		score._v += v;
		score._t += t;
		score.pps._v = v/(t/1000);
		score.print();
		score.pps.print();
	};
	score.pps.print = function(){
		score.pps.innerHTML = score.pps._v.toFixed(2);
	};
	score.print = function(){
		score.innerHTML = score._v.toFixed(2);
	};
	score.init = function(){
		score._t = 0;
		score._v = 0;
		score.pps._v = 0;
		score.print();
	};
	score.reset = function(){
		score.init();
	};
	/* SPEED */
	speed = {};
	speed.getValue = function(c){
			var v, c;
			if (typeof(c)=="undefined" || typeof(speed._v[c])=="undefined") c = speed._v.current;
			v = Math.ceil(Math.sqrt(speed._v[c].sx*speed._v[c].sx+
				speed._v[c].sy*speed._v[c].sy)/(speed._v[c].st/1000));
			return v;
		};
	speed.print = function(){
			document.getElementById('speed').innerHTML = speed.getValue();
		};
	speed.shiftUp = function(el){
			speed._v.current++;
			if (typeof(speed._v[speed._v.current])=="undefined") {
				speed._v.current--;
				if (el>speed._v.st*speed._v.current+speed._v.addBallStep*balls.length) {
					balls.createBall();
				}
			} else {
				for (var i=balls.length;i--;) {
					balls[i]._pos.sx = speed._v[speed._v.current].sx;
					balls[i]._pos.sy = speed._v[speed._v.current].sy;
				}
				speed.print();
			}
		};
	speed.checkShiftUp = function(el){
			if (typeof(el)=="undefined") el = timer.elapsed();
			if (el>speed._v.st*speed._v.current) speed.shiftUp(el);
		};
	speed.init= function(){
			speed._v = level.selected;
			speed._v.current = 1;
		};
	speed.reset = function(){
			speed.init();
			speed.print();
		};
	/* TIMER */
	timer = document.getElementById('timer');
	timer.startTime = null;
	timer.endTime = null;
	timer.check = null;
	timer.start = function(){
			timer.startTime = new Date();
			timer.endTime = null;
			timer.check = setInterval(timer.printTime,100);
		};
	timer.stop = function(){
			timer.endTime = new Date();
			clearInterval(timer.check);
		};
	timer.elapsed = function(){
			return new Date()-timer.startTime;
		};
	timer.finish = function(){
			return timer.endTime-timer.startTime;
		};
	timer.printTime = function(){
			var el,time,m,s,u;
			el = timer.elapsed();
			time = new Date(el);
			if ((m=time.getMinutes().toString()).length<2) m = '0'+m;
			if ((s=time.getSeconds().toString()).length<2) s = '0'+s;
			if ((u=time.getMilliseconds().toString().substr(0,2)).length<2) u = '0'+u;
			timer.innerHTML = m+':'+s+':'+u;
			speed.checkShiftUp(el);
			score.refresh(el);
		};
	/* BALLS */
	balls = document.getElementById('balls-container').getElementsByTagName('div');
	balls.printBallsCount = function(){
			document.getElementById('balls-count').innerHTML = balls.length;
		};
	balls.createBall = function(){
			document.getElementById('balls-container').appendChild(balls[0].cloneNode(true));
			balls[balls.length-1]._pos = {x:0,y:0,sx:speed._v[speed._v.current].sx,sy:speed._v[speed._v.current].sy};
			balls.printBallsCount();
		};
	balls.move = function(){
			 for (var i=balls.length; i--;) {
			 	ball = balls[i];
				if ((ball._pos.x<balls.greenBall._pos.x && ball._pos.sx<0) || (ball._pos.x>balls.greenBall._pos.x && ball._pos.sx>0) || (ball._pos.x+ball._pos.sx>ball._pos.xmax) || (ball._pos.x+ball._pos.sx<ball._pos.xmin)) ball._pos.sx *= -1;
				if ((ball._pos.y<balls.greenBall._pos.y && ball._pos.sy<0) || (ball._pos.y>balls.greenBall._pos.y && ball._pos.sy>0) || (ball._pos.y+ball._pos.sy>ball._pos.ymax) || (ball._pos.y+ball._pos.sy<ball._pos.ymin)) ball._pos.sy *= -1;
				 
				if ((ball._pos.x<balls.greenBall._pos.x && ball._pos.x+ball._pos.sx<=balls.greenBall._pos.x) || (ball._pos.x>balls.greenBall._pos.x && ball._pos.x+ball._pos.sx>=balls.greenBall._pos.x)) ball._pos.x += ball._pos.sx;
				if ((ball._pos.y<balls.greenBall._pos.y && ball._pos.y+ball._pos.sy<=balls.greenBall._pos.y) || (ball._pos.y>balls.greenBall._pos.y && ball._pos.y+ball._pos.sy>=balls.greenBall._pos.y)) ball._pos.y += ball._pos.sy;
						
				ball.style.left = ball._pos.x + 'px';
				ball.style.top 	= ball._pos.y + 'px';
				
				if ((ball._pos.x > balls.greenBall._pos.x-balls.cfg.w+4) && (ball._pos.x < balls.greenBall._pos.x+balls.greenBall.w-4) && (ball._pos.y > balls.greenBall._pos.y-balls.cfg.h) && (ball._pos.y < balls.greenBall._pos.y+balls.greenBall.h)){
					gameControl.gameOver();
				}
			}
		};
	balls.init = function(){
			balls.container = document.getElementById('balls-container');
			balls.container.innerHTML = '<div class="angry-ball"></div>';
			balls.cfg = {w: $(balls[0]).outerWidth(true), h: $(balls[0]).outerHeight(true)};
			balls.cfg.max = {x: mainWin.w-balls.cfg.w, y: mainWin.h-balls.cfg.h, sx: 5, sy: 5};
			balls.cfg.min = {x: 0, y: 0, sx: 1, sy: 1};
			balls[0]._pos = {
					x	: 0,
					y	: 0,
					sx	: speed._v[speed._v.current].sx,
					sy	: speed._v[speed._v.current].sy
				};
			balls.greenBall = document.getElementById('try-to-escape');
			balls.greenBall.style.left = mainWin.w*(4/5)+'px';
			balls.greenBall.style.top  = mainWin.h*(4/5)+'px';
			balls.greenBall.w = $('#try-to-escape').outerWidth(true),
			balls.greenBall.h = $('#try-to-escape').outerHeight(true),
			balls.greenBall._pos = {
					x: parseInt(balls.greenBall.style.left.replace('px', '')),
					y: parseInt(balls.greenBall.style.top.replace('px', ''))
				};
			balls.printBallsCount();
		};
	/* MOUSE */
	mouse = new Object();
	mouse.bindMove = function(){
			$(mainWin).bind('mousemove', function(e){
				balls.greenBall._pos.x = e.pageX-this.offsetLeft-balls.greenBall.w;
				balls.greenBall._pos.y = e.pageY-this.offsetTop-balls.greenBall.h;
				if (balls.greenBall._pos.x<0) balls.greenBall._pos.x = 0;
				if (balls.greenBall._pos.y<0) balls.greenBall._pos.y = 0;
				balls.greenBall.style.left = balls.greenBall._pos.x+'px';
				balls.greenBall.style.top = balls.greenBall._pos.y+'px';
			});
		};
	mouse.unbindMove = function(){
			$(mainWin).unbind('mousemove');
		};
	mouse.bindClickStart = function(){
			$('#run').bind('click', function(){
				if ($(this).hasClass('start')){
					gameControl.start();
					$(this).removeClass('start').addClass('stop').html('start');
				} else if ($(this).hasClass('stop')){
					gameControl.stop();
					$(this).removeClass('stop').addClass('start').html('start');
				} else if ($(this).hasClass('game-over')){
					gameControl.restart();
					$(this).removeClass('game-over').addClass('stop').html('start');
				}
			});
			$('#run').addClass('enable');
		};
	mouse.unbindClickStart = function(){
			$('#run').unbind('click');
			$('#run').removeClass('enable');
		};
	mouse.bindClickChangeLevel = function(){
			$('#change-level').bind('click', function(){
				$('#level-selector').slideDown(1500);
				$('#level-selector-mask').fadeIn(500);
			});
			$('#change-level').addClass('enable');
		};
	mouse.unbindClickChangeLevel = function(){
			$('#change-level').unbind('click');
			$('#change-level').removeClass('enable');
		};
	/* GAME CONTROL */
	gameControl = new Object();
	gameControl.init = function(){
			mouse.bindClickStart();
		};
	gameControl.start = function(){
			$('#control-table').removeClass('game-over');
			speed.init();
			balls.init();
			mouse.bindMove();
			mouse.unbindClickStart();
			mouse.unbindClickChangeLevel();
			timer.start();
			gameControl.run = setInterval(balls.move,10);
			speed.print();
			score.init();
		};
	gameControl.restart = function(){
			speed.init();
			balls.init();
			gameControl.start();
		};
	gameControl.stop = function(){
			clearInterval(gameControl.run);
			mouse.unbindMove();
			mouse.bindClickStart();
			mouse.bindClickChangeLevel();
		};
	gameControl.gameOver = function(){
			timer.stop();
			gameControl.stop();
			$('#control-table').addClass('game-over');
			$('#run').removeClass('stop').addClass('game-over').html('play again?');
		};
	gameControl.clearStatus = function(){
			$('#speed.value').html('0');
			$('#balls-count.value').html('0');
			$('#score-pps.value').html('0');
			$('#timer.value').html('00:00:00');
			$('#score.value').html('0');
			$('#control-table').removeClass('game-over');
			$('#run').removeClass('stop').removeClass('game-over').addClass('start').html('start');
		};
	/* LEVEL */
	level = new Object();
	level._l = [
			{
				1: {sx: 1, sy: 1, st: 10},
				2: {sx: 2, sy: 2, st: 10},
				3: {sx: 3, sy: 3, st: 10},
				4: {sx: 4, sy: 4, st: 10},
				'st'			: 1000,
				'addBallStep'	: 1000
			},
			{
				1: {sx: 1, sy: 1, st: 10},
				2: {sx: 2, sy: 2, st: 10},
				3: {sx: 3, sy: 3, st: 10},
				4: {sx: 4, sy: 4, st: 10},
				5: {sx: 5, sy: 5, st: 10},
				6: {sx: 6, sy: 6, st: 10},
				'st'			: 2000,
				'addBallStep'	: 4000
			},
			{
				1: {sx: 1, sy: 1, st: 10},
				2: {sx: 2, sy: 2, st: 10},
				3: {sx: 3, sy: 3, st: 10},
				4: {sx: 4, sy: 4, st: 10},
				5: {sx: 5, sy: 5, st: 10},
				6: {sx: 6, sy: 6, st: 10},
				7: {sx: 7, sy: 7, st: 10},
				8: {sx: 8, sy: 8, st: 10},
				'st'			: 2000,
				'addBallStep'	: 3000
			}
		];
	level.init = function(){
		mouse.bindClickChangeLevel();
		$('#level-selector').find('.level').live('click', function(){
			$('#level-selector').slideUp(1500, function(){
				$('#level-selector-mask').fadeOut(500);
			});
			var l = parseInt($(this).attr('level'));
			level.selected = level._l[l-1];
			$('#level.value').html(l);
			gameControl.clearStatus();
		});
		gameControl.init();
	};
	level.select = function(){
	};
	
	level.init();
});
