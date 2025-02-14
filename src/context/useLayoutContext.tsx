'use client'
import { createContext, useCallback, useEffect, useMemo, useState, useContext } from 'react'
import type { ChildrenType } from '@/types/component-props'
import type { LayoutState, LayoutType, MenuType, OffcanvasControlType, LayoutOffcanvasStatesType, ThemeType } from '@/types/context'

import { toggleDocumentAttribute } from '@/utils/layout'
import useQueryParams from '@/hooks/useQueryParams'
import useLocalStorage from '@/hooks/useLocalStorage'

const ThemeContext = createContext<LayoutType | undefined>(undefined)

const useLayoutContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider');
  }
  return context;
};

const getPreferredTheme = (): ThemeType => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const LayoutProvider = ({ children }: ChildrenType) => {
  const queryParams = useQueryParams()
  const override = !!(queryParams.layout_theme || queryParams.topbar_theme || queryParams.menu_theme || queryParams.menu_size)

  const [settings, setSettings] = useLocalStorage<LayoutState>('__REBACK_NEXT_CONFIG__', {
    theme: queryParams['layout_theme'] ? (queryParams['layout_theme'] as ThemeType) : getPreferredTheme(),
    topbarTheme: queryParams['topbar_theme'] ? (queryParams['topbar_theme'] as ThemeType) : 'light',
    menu: {
      theme: queryParams['menu_theme'] ? (queryParams['menu_theme'] as MenuType['theme']) : 'light',
      size: queryParams['menu_size'] ? (queryParams['menu_size'] as MenuType['size']) : 'default',
    },
  }, override)

  const [offcanvasStates, setOffcanvasStates] = useState<LayoutOffcanvasStatesType>({
    showThemeCustomizer: false,
    showActivityStream: false,
    showBackdrop: false,
  })

  const updateSettings = useCallback((_newSettings: Partial<LayoutState>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ..._newSettings }))
  }, [setSettings])

  const changeTheme = useCallback((newTheme: ThemeType) => updateSettings({ theme: newTheme }), [updateSettings])
  const changeTopbarTheme = useCallback((newTheme: ThemeType) => updateSettings({ topbarTheme: newTheme }), [updateSettings])
  const changeMenuTheme = useCallback((newTheme: MenuType['theme']) => updateSettings({ menu: { ...settings.menu, theme: newTheme } }), [settings.menu, updateSettings])
  const changeMenuSize = useCallback((newSize: MenuType['size']) => updateSettings({ menu: { ...settings.menu, size: newSize } }), [settings.menu, updateSettings])

  const toggleThemeCustomizer: OffcanvasControlType['toggle'] = useCallback(() => {
    setOffcanvasStates((prev) => ({ ...prev, showThemeCustomizer: !prev.showThemeCustomizer }))
  }, [])

  const toggleActivityStream: OffcanvasControlType['toggle'] = useCallback(() => {
    setOffcanvasStates((prev) => ({ ...prev, showActivityStream: !prev.showActivityStream }))
  }, [])

  const toggleBackdrop = useCallback(() => {
    setOffcanvasStates((prev) => {
      const newState = { ...prev, showBackdrop: !prev.showBackdrop }
      const htmlTag = document.getElementsByTagName('html')[0]
      if (newState.showBackdrop) htmlTag.classList.add('sidebar-enable')
      else htmlTag.classList.remove('sidebar-enable')
      return newState
    })
  }, [])

  useEffect(() => {
    toggleDocumentAttribute('data-bs-theme', settings.theme)
    toggleDocumentAttribute('data-topbar-color', settings.topbarTheme)
    toggleDocumentAttribute('data-menu-color', settings.menu.theme)
    toggleDocumentAttribute('data-menu-size', settings.menu.size)
    
    return () => {
      toggleDocumentAttribute('data-bs-theme', settings.theme, true)
      toggleDocumentAttribute('data-topbar-color', settings.topbarTheme, true)
      toggleDocumentAttribute('data-menu-color', settings.menu.theme, true)
      toggleDocumentAttribute('data-menu-size', settings.menu.size, true)
    }
  }, [settings.theme, settings.topbarTheme, settings.menu.theme, settings.menu.size])

  const resetSettings = useCallback(() => {
    updateSettings({
      theme: queryParams['layout_theme'] ? (queryParams['layout_theme'] as ThemeType) : getPreferredTheme(),
      topbarTheme: queryParams['topbar_theme'] ? (queryParams['topbar_theme'] as ThemeType) : 'light',
      menu: {
        theme: queryParams['menu_theme'] ? (queryParams['menu_theme'] as MenuType['theme']) : 'light',
        size: queryParams['menu_size'] ? (queryParams['menu_size'] as MenuType['size']) : 'default',
      },
    })
  }, [updateSettings, queryParams])

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          ...settings,
          themeMode: settings.theme,
          changeTheme,
          changeTopbarTheme,
          changeMenu: {
            theme: changeMenuTheme,
            size: changeMenuSize,
          },
          themeCustomizer: {
            open: offcanvasStates.showThemeCustomizer,
            toggle: toggleThemeCustomizer,
          },
          activityStream: {
            open: offcanvasStates.showActivityStream,
            toggle: toggleActivityStream,
          },
          toggleBackdrop,
          resetSettings,
        }),
        [settings, offcanvasStates, changeTheme, changeTopbarTheme, changeMenuTheme, changeMenuSize, toggleThemeCustomizer, toggleActivityStream, toggleBackdrop, resetSettings]
      )}>
      {children}
      {offcanvasStates.showBackdrop && <div className="offcanvas-backdrop fade show" onClick={toggleBackdrop} />}
    </ThemeContext.Provider>
  )
}

export { LayoutProvider, useLayoutContext }
