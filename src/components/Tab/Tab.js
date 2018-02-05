import React from 'react';
import { TabPane } from './TabPane';
import { DefaultTabBar } from './TabBar';
import { getTransformPropValue } from './util';
import { TabBase } from './Tab.base';
import '../../assets/style/components/Tab/index.less'


export class Tabs extends TabBase {
  static DefaultTabBar = DefaultTabBar;

  static defaultProps = {
    ...TabBase.defaultProps,
    prefixCls: 'am-tabs',
  };

  layout;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isMoving: false,
      contentPos: this.getContentPosByIndex(
        this.getTabIndex(props),
        this.isTabVertical(props.tabDirection),
        props.useLeftInsteadTransform
      ),
    };
  }

  goToTab(index, force = false, usePaged = this.props.usePaged) {
    const { tabDirection, useLeftInsteadTransform } = this.props;
    let newState = {};
    if (usePaged) {
      newState = {
        contentPos: this.getContentPosByIndex(
          index,
          this.isTabVertical(tabDirection),
          useLeftInsteadTransform
        ),
      };
    }
    return super.goToTab(index, force, newState);
  }

  tabClickGoToTab(index) {
    this.goToTab(index, false, true);
  }

  getContentPosByIndex(index, isVertical, useLeft = false) {
    const value = `${-index * 100}%`;
    if (useLeft) {
      return `${value}`;
    } else {
      const translate = isVertical ? `0px, ${value}` : `${value}, 0px`;
      // fix: content overlay TabBar on iOS 10. ( 0px -> 1px )
      return `translate3d(${translate}, 1px)`;
    }
  }

  setContentLayout = (div) => {
    this.layout = div;
  }

  renderContent(getSubElements = this.getSubElements()) {
    const { prefixCls, tabs, animated, destroyInactiveTab, useLeftInsteadTransform } = this.props;
    const { currentTab, isMoving, contentPos } = this.state;
    const isTabVertical = this.isTabVertical();

    let contentCls = `${prefixCls}-content-wrap`;
    if (animated && !isMoving) {
      contentCls += ` ${contentCls}-animated`;
    }
    const contentStyle = animated ? (
      useLeftInsteadTransform ? {
        position: 'relative',
        ...this.isTabVertical() ? { top: contentPos, } : { left: contentPos, }
      } : getTransformPropValue(contentPos)
    ) : {
        position: 'relative',
        ...this.isTabVertical() ? { top: `${-currentTab * 100}%`, } : { left: `${-currentTab * 100}%`, }
      };

    return <div className={contentCls} style={contentStyle} ref={this.setContentLayout} key="$content">
      {
        tabs.map((tab, index) => {
          let cls = `${prefixCls}-pane-wrap`;
          if (this.state.currentTab === index) {
            cls += ` ${cls}-active`;
          } else {
            cls += ` ${cls}-inactive`;
          }

          const key = tab.key || `tab_${index}`;

          // update tab cache
          if (this.shouldRenderTab(index)) {
            this.tabCache[index] = this.getSubElement(tab, index, getSubElements);
          } else if (destroyInactiveTab) {
            this.tabCache[index] = undefined;
          }

          return <TabPane key={key} className={cls}
            active={currentTab === index}
            fixX={isTabVertical} fixY={!isTabVertical}
          >
            {this.tabCache[index]}
          </TabPane>;
        })
      }
    </div>;
  }

  render() {
    const { prefixCls, tabBarPosition, tabDirection, noRenderContent } = this.props;

    const tabBarProps = {
      ...this.getTabBarBaseProps(),
    };

    const content = [
      <div key="tabBar" className={`${prefixCls}-tab-bar-wrap`}>
        {this.renderTabBar(tabBarProps, DefaultTabBar)}
      </div>,
      !noRenderContent && this.renderContent()
    ];

    return <div className={`${prefixCls} ${prefixCls}-${tabDirection} ${prefixCls}-${tabBarPosition}`}>
      {
        tabBarPosition === 'top' || tabBarPosition === 'left' ? content : content.reverse()
      }
    </div>;
  }
}
