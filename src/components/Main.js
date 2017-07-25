require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片的相关信息
let imageDatas = require('../data/imageDatas.json');
//let imageUrl = require('../images/yeoman.png');
// 利用立即执行函数，将图片信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDatasArr){
	for(var i=0; i<imageDatasArr.length; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取0-30度之间的一个任意正负值
 */
function get30DegRandom(){
	return((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


// 单个图片组件
// class ImgFigure extends React.Component {
let ImgFigure = React.createClass({
	
	/*
	 * 图片 imgFigure 的点击事件
	 */
	handleClick:function(e){
		
		// 判断所点击图片是否居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	},
	
	
	render:function(){
		
		var styleObj = {};
		
		// 如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		
		// 如果图片的旋转角度有值并且不为0，天假旋转角度
		if(this.props.arrange.rotate) {
			(['-moz-','-webkit-','-ms-','']).forEach(function(value){
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
			
		}
		
		if(this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img className="imgs" src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcation>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcation>
			</figure>
		);
	}
});

// 舞台组件
//class AppComponent extends React.Component {
let AppComponent = React.createClass({
	Constant:{
		// 中心图片位置的取值范围
		centerPos:{
			left:0,
			top:0
		},
		// 水平方向的取值范围
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		// 垂直方向的取值范围
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	},
	
	
	/*
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	inverse:function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this)
	},

	
	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定居中排布哪个图片 
	 */
	rearrange:function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),  // 取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
			
		//  首先居中  centerIndex 的图片,不用旋转
		imgsArrangeCenterArr[0] = {
			pos:centerPos,
			rotate:0,
			isCenter:true
		};
		
		//  取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum );
		
		//  布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index] = {
				pos:{
					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
				},
				rotate:get30DegRandom(),
				isCenter:false
			};
		});
		
		//  布局左右两侧的图片
		for(var i = 0,j = imgsArrangeArr.length, k = j/2; i < j; i++){
			var hPosRangeLORX = null;
			
			//  前半部分布局左边，右半部分布局右边
			if(i < k){
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			
			imgsArrangeArr[i] = {
				pos:{
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
				},
				rotate:get30DegRandom(),
				isCenter:false
			};
		}
		
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	},
	
	
	/*
	 * 利用 rearrange 函数，居中对应index的图片
	 * @param index, 需要被居中的图片对应的 图片信息数组的index值
	 * @return {Function}
	 */
	center:function(index){
		return function(){
			this.rearrange(index);
		}.bind(this)
	},
	
	
	getInitialState:function(){
		return{
			imgsArrangeArr:[
//				{
//					pos:{
//						left:'0',
//						top:'0'
//					},
//                  rotate: 0,	        //  旋转角度
//                  isInverse: false,   // 是否翻转图片
//					isCenter:false
//				}
			]
		}
	},
	
	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount:function(){
		
		// 拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			haflStageW = Math.ceil(stageW / 2),
			haflStageH = Math.ceil(stageH / 2);
			
		// 拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		
		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left:haflStageW-halfImgW,
			top:haflStageH-halfImgH
		};
		
		// 计算左侧、右侧区域图片的位置点
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] =haflStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = haflStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] =stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH -halfImgH;
		
		// 计算上侧区域图片的位置点
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = haflStageH -halfImgH * 3;
		this.Constant.vPosRange.x[0] = haflStageW - imgW;
		this.Constant.vPosRange.x[1] = haflStageW;
		
		this.rearrange(0);
	},
	
	
	render:function(){
  		var controllerUnits = [],
  			ImgFigures = [];
		imageDatas.forEach(function(value,index){
			
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index]={
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				};
			}
			
			ImgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} key={index} />);
		}.bind(this));
  	
	    return (
	        <div className="stage" ref="stage">
		      	<div className="img-sec">
		      		{ImgFigures}
		      	</div>
		      	<div className="controller-nav">
		      		controllerUnits
		      	</div>
		    </div>
	    )
	}
});

AppComponent.defaultProps = {
};

export default AppComponent;
