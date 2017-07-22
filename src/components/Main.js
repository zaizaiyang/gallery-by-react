require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


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
	
};

// 单个图片组件
class ImgFigure extends React.Component {
	render(){
		
		var styleObj = {};
		
		
		return(
			<figure className="img-figure">
				<img className="imgs" src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcation>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcation>
			</figure>
		);
	}
};

// 舞台组件
class AppComponent extends React.Component {
	Constant:{
		centerPos:{		// 中心图片位置的取值范围
			left:0,
			right:0,
		},
		hPosRange:{		// 水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{		// 垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
		
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
			vPosRangeX = vPosRange.X,
			
			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),  // 取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
			
		//  首先居中  centerIndex 的图片
		imgsArrangeCenterArr[0].pos = centerPos;
		
		//  取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum );
		
		//  布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index].pos = {
				top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left:getRangeRandom.(vPosRangeX[0],vPosRangeX[1])
			}
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
			
			imgsArrangeArr[i].pos = {
				top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
			}
		};
		
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	},
	
	getInitialState:function(){
		return{
			imgsArrangeArr:[
//				{
//					pos:{
//						left:'0',
//						top:'0'
//					}
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
		
		this.rearrange()
	},
	
  	render:function() {
  		var controllerUnits = [],
  			ImgFigures = [];
		imageDatas.forEach(function(value,index){
			
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index]=[
					pos:{
						left:'0',
						top:'0'
					}
				]
			}
			
			ImgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} />);
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
	    );
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
