# Mimodots — Плагин для Adobe Illustrator

Пиксельный грид-генератор иконок в виде панели для Adobe Illustrator.

## Установка

1. Скопируйте папку `MimodotsPlugin` в:
   - **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/`
   - **Windows:** `%APPDATA%\Adobe\CEP\extensions\`

2. Включите режим разработчика (если ещё не включён):
   - **macOS:** `defaults write com.adobe.CSXS.10 PlayerDebugMode 1`
   - **Windows:** создайте ключ реестра `PlayerDebugMode` = `1` в `HKCU\Software\Adobe\CSXS.10`

3. Перезапустите Illustrator. Плагин будет в меню **Window → Extensions → Mimodots Pixel Grid**

## Что делает

- Генерирует пиксельную сетку прямо в документе Illustrator
- Квадратные, круглые и шестиугольные пиксели
- Настройка зазора и цвета
- Импорт SVG в документ
- Экспорт выделения как SVG

## Требования

- Adobe Illustrator 2022 (v26.0) или выше
