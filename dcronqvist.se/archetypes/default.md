---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'

tags: []
author: "dcronqvist"
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: '{{ replace .File.ContentBaseName "-" " " | title }} Desc Text.'
disableHLJS: false # to disable highlightjs
disableShare: true
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: false
ShowRssButtonInSectionTermList: true
UseHugoToc: false
cover:
    image: "images/static/dcronqvist.jpg" # image path/url
---
