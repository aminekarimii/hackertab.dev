import React, { useContext, useState } from "react";
import ReactModal from 'react-modal';
import "react-toggle/style.css"
import { VscClose } from "react-icons/vsc"
import Select from 'react-select'
import Toggle from 'react-toggle'
import '../App.css';
import './settings.css';
import PreferencesContext from '../preferences/PreferencesContext';
import ConfigurationContext from '../configuration/ConfigurationContext';
import {
  SUPPORTED_CARDS,
  SUPPORTED_SEARCH_ENGINES,
  SUPPORTED_LAYOUT_TYPES,
  APP,
} from '../Constants'
import {
  trackAddLanguage,
  trackRemoveLanguage,
  trackAddCard,
  trackRemoveCard,
  trackOpenLinksNewTab,
  trackListingModeChange,
  trackSearchEngineChange,
  trackLayoutTypeChange,
} from '../utils/Analytics'

function SettingsModal({ showSettings, setShowSettings }) {
  const { supportedTags } = useContext(ConfigurationContext)
  const preferences = useContext(PreferencesContext)
  const {
    dispatcher,
    cards,
    userSelectedTags,
    openLinksNewTab,
    listingMode,
    theme,
    searchEngine,
    layoutType = 'deck',
  } = preferences
  const [selectedCards, setSelectedCards] = useState(cards)

  const handleCloseModal = () => {
    setShowSettings(false)
  }

  const onTagsSelectChange = (tags, metas) => {
    switch (metas.action) {
      case 'select-option':
        trackAddLanguage(metas.option.label)
        break
      case 'remove-value':
        trackRemoveLanguage(metas.removedValue.label)
        break
    }

    dispatcher({ type: 'setUserSelectedTags', value: tags })
  }

  const onlistingModeChange = (e) => {
    const value = e.target.checked ? 'compact' : 'normal'
    trackListingModeChange(value)
    dispatcher({ type: 'changelistingMode', value })
  }

  const onCardSelectChange = (cards, metas) => {
    switch (metas.action) {
      case 'select-option':
        trackAddCard(metas.option.label)
        break
      case 'remove-value':
        trackRemoveCard(metas.removedValue.label)
        break
    }

    let newCards = cards.map((c, index) => {
      return { id: index, name: c.value }
    })
    setSelectedCards(newCards)
    dispatcher({ type: 'setCards', value: newCards })
  }

  const onSearchEngineSelectChange = (value) => {
    trackSearchEngineChange(value.label)
    dispatcher({ type: 'setSearchEngine', value })
  }

  const onOpenLinksNewTabChange = (e) => {
    const checked = e.target.checked
    trackOpenLinksNewTab(checked)
    dispatcher({ type: 'setOpenLinksNewTab', value: checked })
  }

  const onDarkModeChange = (e) => {
    dispatcher({ type: 'toggleTheme' })
  }

  const onLayoutTypeChange = (layoutType) => {
    trackLayoutTypeChange(layoutType.label)
    dispatcher({ type: 'setLayoutType', value: layoutType.value })
  }

  return (
    <ReactModal
      isOpen={showSettings}
      ariaHideApp={false}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={false}
      onRequestClose={() => handleCloseModal()}
      contentLabel="Minimal Modal Example"
      className="Modal"
      overlayClassName="Overlay">
      <div className="modalHeader">
        <h1 className="modalTitle">Settings</h1>
        <button className="modalCloseBtn" onClick={handleCloseModal}>
          <VscClose size="24" />
        </button>
      </div>

      <div className="settings">
        <div className="settingRow">
          <p className="settingTitle">Programming languages you're interested in</p>
          <div className="settingContent">
            <Select
              options={supportedTags}
              defaultValue={userSelectedTags}
              isMulti={true}
              isClearable={false}
              isSearchable={false}
              classNamePrefix={'hackertab'}
              onChange={onTagsSelectChange}
            />
            <p className="settingHint">
              Missing language or technology? create an issue{' '}
              <a href="#" onClick={(e) => window.open(APP.supportLink, '_blank')}>
                here
              </a>
            </p>
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Displayed Cards</p>
          <div className="settingContent">
            <Select
              options={SUPPORTED_CARDS}
              value={selectedCards.map((c) => ({
                label: SUPPORTED_CARDS.find((c2) => c.name == c2.value).label,
                value: c.name,
              }))}
              onChange={onCardSelectChange}
              isMulti={true}
              isClearable={false}
              isSearchable={false}
              classNamePrefix={'hackertab'}
            />
            <p className="settingHint">
              Missing a cool data source? create an issue{' '}
              <a href="#" onClick={(e) => window.open(APP.supportLink, '_blank')}>
                here
              </a>
            </p>
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Dark Mode</p>
          <div className="settingContent">
            <Toggle checked={theme === 'dark'} icons={false} onChange={onDarkModeChange} />
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Open links in a new tab</p>
          <div className="settingContent">
            <Toggle checked={openLinksNewTab} icons={false} onChange={onOpenLinksNewTabChange} />
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Compact mode</p>
          <div className="settingContent">
            <Toggle
              checked={listingMode == 'compact'}
              icons={false}
              onChange={onlistingModeChange}
            />
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Layout type</p>
          <div className="settingContent">
            <Select
              options={SUPPORTED_LAYOUT_TYPES}
              value={SUPPORTED_LAYOUT_TYPES.find((type) => type.value == layoutType)}
              isMulti={false}
              isClearable={false}
              isSearchable={false}
              classNamePrefix={'hackertab'}
              onChange={onLayoutTypeChange}
            />
          </div>
        </div>

        <div className="settingRow">
          <p className="settingTitle">Favorite search engine</p>
          <div className="settingContent">
            <Select
              options={SUPPORTED_SEARCH_ENGINES}
              value={SUPPORTED_SEARCH_ENGINES.find((e) => e.label == searchEngine)}
              isMulti={false}
              isClearable={false}
              isSearchable={false}
              classNamePrefix={'hackertab'}
              onChange={onSearchEngineSelectChange}
            />
            <p className="settingHint">
              Missing a search engine? create an issue{' '}
              <a href="#" onClick={(e) => window.open(APP.supportLink, '_blank')}>
                here
              </a>
            </p>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default SettingsModal
