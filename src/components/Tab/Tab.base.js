import React from 'react';

export class TabBase extends React.PureComponent {
  static defaultProps = {
    tabBarPosition: 'top',
    initialPage: 0,
    animated: true,
    prerenderingSiblingsNumber: 1,
    Base: [],
    destroyInactiveTab: false,
    usePaged: true,
    tabDirection: 'horizontal',
    distanceToChangeTab: .3,
  }

  prevCurrentTab;
  tabCache = {};

  /** compatible for different between react and preact in `setState`. */
  nextCurrentTab;

  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.getTabIndex(props),
    }
    this.nextCurrentTab = this.state.currentTab;
  }

  getTabIndex(props) {
    const { page, initialPage, tabs } = props;
    const param = (page !== undefined ? page : initialPage) || 0;

    let index = 0;
    if (typeof param === 'string') {
      tabs.forEach((t, i) => {
        if (t.key === param) {
          index = i;
        }
      });
    } else {
      index = param || 0;
    }
    return index < 0 ? 0 : index;
  }

  isTabVertical = (direction = this.props.tabDirection) => direction === 'vertical';

  shouldRenderTab = (idx) => {
    const { prerenderingSiblingsNumber = 0 } = this.props;
    const { currentTab = 0 } = this.state;

    return currentTab - prerenderingSiblingsNumber <= idx && idx <= currentTab + prerenderingSiblingsNumber;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page && nextProps.page !== undefined) {
      this.goToTab(this.getTabIndex(nextProps), true);
    }
  }

  componentDidMount() {
    this.prevCurrentTab = this.state.currentTab;
  }

  componentDidUpdate() {
    this.prevCurrentTab = this.state.currentTab;
  }

  getOffsetIndex = (current, width, threshold = this.props.distanceToChangeTab || 0) => {
    const ratio = Math.abs(current / width);
    const direction = ratio > this.state.currentTab ? '<' : '>';
    const index = Math.floor(ratio);
    switch (direction) {
      case '<':
        return ratio - index > threshold ? index + 1 : index;
      case '>':
        return 1 - ratio + index > threshold ? index : index + 1;
      default:
        return Math.round(ratio);
    }
  }

  goToTab(index, force = false, newState = {}) {
    if (!force && this.nextCurrentTab === index) {
      return false;
    }
    this.nextCurrentTab = index;
    const { tabs, onChange } = this.props;
    if (index >= 0 && index < tabs.length) {
      if (!force) {
        onChange && onChange(tabs[index], index);
        if (this.props.page !== undefined) {
          return false;
        }
      }

      this.setState({
        currentTab: index,
        ...newState,
      });
    }
    return true;
  }

  tabClickGoToTab(index) {
    this.goToTab(index);
  }

  getTabBarBaseProps() {
    const { currentTab } = this.state;

    const {
      animated,
      onTabClick,
      tabBarActiveTextColor,
      tabBarBackgroundColor,
      tabBarInactiveTextColor,
      tabBarPosition,
      tabBarTextStyle,
      tabBarUnderlineStyle,
      tabs,
     } = this.props;
    return {
      activeTab: currentTab,
      animated: !!animated,
      goToTab: this.tabClickGoToTab.bind(this),
      onTabClick,
      tabBarActiveTextColor,
      tabBarBackgroundColor,
      tabBarInactiveTextColor,
      tabBarPosition,
      tabBarTextStyle,
      tabBarUnderlineStyle,
      tabs,
    };
  }

  renderTabBar(tabBarProps, DefaultTabBar) {
    const { renderTabBar } = this.props;
    if (renderTabBar === false) {
      return null;
    } else if (renderTabBar) {
      // return React.cloneElement(this.props.renderTabBar(props), props);
      return renderTabBar(tabBarProps);
    } else {
      return <DefaultTabBar {...tabBarProps} />;
    }
  }

  getSubElements = () => {
    const { children } = this.props;
    let subElements = {};

    return (defaultPrefix = '$i$-', allPrefix = '$ALL$') => {
      if (Array.isArray(children)) {
        children.forEach((child, index) => {
          if (child.key) {
            subElements[child.key] = child;
          }
          subElements[`${defaultPrefix}${index}`] = child;
        });
      } else if (children) {
        subElements[allPrefix] = children;
      }
      return subElements;
    };
  }

  getSubElement(
    tab,
    index,
    subElements: (defaultPrefix, allPrefix) => { },
    defaultPrefix = '$i$-',
    allPrefix = '$ALL$'
  ) {
    const key = tab.key || `${defaultPrefix}${index}`;
    const elements = subElements(defaultPrefix, allPrefix);
    let component = elements[key] || elements[allPrefix];
    if (component instanceof Function) {
      component = component(tab, index);
    }
    return component || null;
  }
}
