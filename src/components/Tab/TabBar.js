import React from 'react';
import { getTransformPropValue, getPxStyle } from './util';

export class DefaultTabBar extends React.PureComponent {
  static defaultProps = {
    prefixCls: 'am-tabs-default-bar',
    animated: true,
    tabs: [],
    goToTab: () => { },
    activeTab: 0,
    page: 5,
    tabBarUnderlineStyle: {},
    tabBarBackgroundColor: '#fff',
    tabBarActiveTextColor: '',
    tabBarInactiveTextColor: '',
    tabBarTextStyle: {},
  };

  layout;

  constructor(props) {
    super(props);
    this.state = {
      transform: '',
      isMoving: false,
      showPrev: false,
      showNext: false,
      ...this.getTransformByIndex(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.activeTab !== nextProps.activeTab ||
      this.props.tabs !== nextProps.tabs ||
      this.props.tabs.length !== nextProps.tabs.length
    ) {
      this.setState({
        ...this.getTransformByIndex(nextProps)
      });
    }
  }

  getTransformByIndex = (props) => {
    const { activeTab, tabs, page = 0 } = props;
    const isVertical = this.isTabBarVertical();

    const size = this.getTabSize(page, tabs.length);
    const center = page / 2;
    let pos = Math.min(activeTab, tabs.length - center - .5);
    const skipSize = Math.min(-(pos - center + .5) * size, 0);
    return {
      transform: getPxStyle(skipSize, '%', isVertical),
      showPrev: activeTab > center - .5 && tabs.length > page,
      showNext: activeTab < tabs.length - center - .5 && tabs.length > page,
    };
  }

  onPress = (index) => {
    const { goToTab, onTabClick, tabs } = this.props;
    onTabClick && onTabClick(tabs[index], index);
    goToTab && goToTab(index);
  }

  isTabBarVertical = (position = this.props.tabBarPosition) => position === 'left' || position === 'right';

  renderTab = (t, i, size, isTabBarVertical) => {
    const {
      prefixCls, renderTab, activeTab,
      tabBarTextStyle,
      tabBarActiveTextColor,
      tabBarInactiveTextColor,
    } = this.props;

    const textStyle = { ...tabBarTextStyle };
    let cls = `${prefixCls}-tab`;
    if (activeTab === i) {
      cls += ` ${cls}-active`;
      if (tabBarActiveTextColor) {
        textStyle.color = tabBarActiveTextColor;
      }
    } else if (tabBarInactiveTextColor) {
      textStyle.color = tabBarInactiveTextColor;
    }

    return <div key={`t_${i}`}
      style={{
        ...textStyle,
        ...isTabBarVertical ? { height: `${size}%` } : { width: `${size}%` },
      }}
      className={cls}
      onClick={() => this.onPress(i)}
    >
      {renderTab ? renderTab(t) : t.title}
    </div>;
  }

  setContentLayout = (div) => {
    this.layout = div;
  }

  getTabSize = (page, tabLength) => 100 / Math.min(page, tabLength);

  render() {
    const {
      prefixCls, animated, tabs = [], page = 0, activeTab = 0,
      tabBarBackgroundColor, tabBarUnderlineStyle, tabBarPosition,
      renderUnderline,
    } = this.props;
    const { isMoving, transform, showNext, showPrev } = this.state;
    const isTabBarVertical = this.isTabBarVertical();

    const needScroll = tabs.length > page;
    const size = this.getTabSize(page, tabs.length);

    const Tabs = tabs.map((t, i) => {
      return this.renderTab(t, i, size, isTabBarVertical);
    });

    let cls = prefixCls;
    if (animated && !isMoving) {
      cls += ` ${prefixCls}-animated`;
    }

    let style = {
      backgroundColor: tabBarBackgroundColor || '',
    };

    let transformStyle = needScroll ? {
      ...getTransformPropValue(transform),
    } : {};

    const underlineProps = {
      style: {
        ...isTabBarVertical ? { height: `${size}%` } : { width: `${size}%` },
        ...isTabBarVertical ? { top: `${size * activeTab}%` } : { left: `${size * activeTab}%` },
        ...tabBarUnderlineStyle,
      },
      className: `${prefixCls}-underline`,
    };

    return <div className={`${cls} ${prefixCls}-${tabBarPosition}`} style={style}>
      {showPrev && <div className={`${prefixCls}-prevpage`}></div>}
      <div className={`${prefixCls}-content`} style={transformStyle} ref={this.setContentLayout}>
        {Tabs}
        {
          renderUnderline ? renderUnderline(underlineProps) :
            <div {...underlineProps}></div>
        }
      </div>
      {showNext && <div className={`${prefixCls}-nextpage`}></div>}
    </div>;
  }
}
