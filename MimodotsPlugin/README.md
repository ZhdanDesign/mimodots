# Mimodots — Плагин для Adobe Illustrator

UXP-плагин для Adobe Illustrator. Создаёт пиксельные сетки прямо в документе.

## Установка

### Способ 1: UXP Developer Tool (рекомендуется)

1. Установите [UXP Developer Tool](https://developer.adobe.com/console/apis/uxp) через Creative Cloud
2. Откройте UDT, нажмите «Add Plugin» и выберите папку `MimodotsPlugin`
3. Нажмите «Load» — плагин появится в Illustrator

### Способ 2: Вручную

Скопируйте папку `MimodotsPlugin` в:

```
~/Library/Application Support/Adobe/UXP/Plugins/com.mimodots.pixelgrid/
```

Перезапустите Illustrator. Плагин будет в **Window → Extensions → Mimodots Pixel Grid**.

## Что делает

- Генерирует пиксельную сетку в документе Illustrator
- Квадратные, круглые и шестиугольные пиксели
- Настройка зазора и цвета
- Импорт SVG в документ
- Экспорт выделения как SVG

## Требования

- Adobe Illustrator 2024 (v29.0) или выше
