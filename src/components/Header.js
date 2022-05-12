import React, { useEffect, useRef, useState } from 'react'
import { BsFillGearFill, BsFillGrid1X2Fill } from 'react-icons/bs'
import { CgTab } from 'react-icons/cg'
import { BsFillBookmarksFill } from 'react-icons/bs'
import { ReactComponent as HackertabLogo } from '../logo.svg'
import UserTags from './UserTags'
import { SUPPORTED_SEARCH_ENGINES } from '../Constants'
import SettingsModal from '../settings/SettingsModal'
import { BsMoon } from 'react-icons/bs'
import { IoMdSunny } from 'react-icons/io'
import { trackThemeChange, trackSearch } from '../utils/Analytics'
import Changelog from './Changelog'
import { GoSearch } from 'react-icons/go'
import { MdViewColumn } from 'react-icons/md'

function SearchBar({ state }) {
  const keywordsInputRef = React.useRef(null)
  const userSearchEngine = SUPPORTED_SEARCH_ENGINES.find(
    (engine) => engine.label == state.searchEngine
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const keywords = e.target.children[1].value
    trackSearch(userSearchEngine.label)
    window.open(`${userSearchEngine.url}${keywords}`, '_self')
  }

  useEffect(() => {
    keywordsInputRef.current.focus()
  }, [])

  return (
    <form className="searchBar" onSubmit={handleSubmit}>
      <GoSearch className="searchBarIcon" size={20} />
      <input
        ref={keywordsInputRef}
        type="text"
        className="searchBarInput"
        placeholder={`Search on ${userSearchEngine.label}`}
      />
    </form>
  )
}
function Header({ state, dispatcher, showSideBar, setShowSideBar, showSettings, setShowSettings }) {
  const [themeIcon, setThemeIcon] = useState(<BsMoon />)
  const [layoutIcon, setLayoutIcon] = useState()

  const isFirstRun = useRef(true)

  useEffect(() => {
    document.documentElement.classList.add(state.theme)
  }, [])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
      if (!document.documentElement.classList.contains('transitionBgColor')) {
        document.documentElement.classList.add('transitionBgColor')
      }
      trackThemeChange(state.theme)
    }

    if (state.theme === 'light') {
      document.documentElement.classList.replace('dark', state.theme)
      setThemeIcon(<BsMoon />)
    } else if (state.theme === 'dark') {
      document.documentElement.classList.replace('light', state.theme)
      setThemeIcon(<IoMdSunny />)
    }
  }, [state?.theme])

  useEffect(() => {
    if (!state?.layoutType || state.layoutType == 'deck') {
      setLayoutIcon(<BsFillGrid1X2Fill />)
    } else {
      setLayoutIcon(<MdViewColumn />)
    }
  }, [state?.layoutType])

  const onThemeChange = () => {
    dispatcher({ type: 'toggleTheme' })
  }

  const onSettingsClick = () => {
    setShowSettings(true)
  }

  const BookmarksBadgeCount = () => {
    return state.userBookmarks.length > 0 ? (
      state.userBookmarks.length < 10 ? (
        <span className="badgeCount">{state.userBookmarks.length}</span>
      ) : (
        <span className="badgeCount">+9</span>
      )
    ) : null
  }

  const onLayoutChange = () => {
    if (!state.layoutType || state.layoutType == 'deck') {
      dispatcher({ type: 'setLayoutType', value: 'feed' })
    } else {
      dispatcher({ type: 'setLayoutType', value: 'deck' })
    }
  }

  return (
    <>
      <SettingsModal showSettings={showSettings} setShowSettings={setShowSettings} />

      <header className="AppHeader">
        <span className="AppName">
          <i className="logo">
            <CgTab />
          </i>{' '}
          <HackertabLogo className="logoText" />
          <Changelog />
        </span>
        <SearchBar state={state} />
        <div className="extras">
          <button className="extraBtn" onClick={onSettingsClick}>
            <BsFillGearFill />
          </button>
          <button className="extraBtn" onClick={onLayoutChange}>
            {layoutIcon}
          </button>
          <button className="extraBtn darkModeBtn" onClick={onThemeChange}>
            {themeIcon}
          </button>
          <button className="extraBtn" onClick={() => setShowSideBar(!showSideBar)}>
            <BsFillBookmarksFill />
            <BookmarksBadgeCount />
          </button>
        </div>
        <div className="break"></div>
        <UserTags userSelectedTags={state.userSelectedTags} onAddClicked={onSettingsClick} />
      </header>
    </>
  )
}

export default Header;