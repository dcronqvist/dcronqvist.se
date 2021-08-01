---
title: danpass
tags:
  - python
  - cli-tool
description: 🔑 a terminal based password manager written in Python
link:
  url: https://github.com/dcronqvist/danpass
  type: github-repo
---
### A simple password manager

The life on the internet can get out of hand quite quickly since you need accounts on every single website if feels like. So I thought, why not make a password manager to learn a bit about encryption! 

All passwords in danpass are saved using [Fernet encryption](https://cryptography.io/en/latest/fernet/), which is very basic - but it does the job! Using **danpass** is super easy, since it only works from the command line. Need all your google account passwords?

```bash
$ danpass find -s google -l
Found 1 entry in danpass.
-----------------------------------
ID:             1
Website:        google.com
Username:       johndoe@example.com
Password:       whatsinthebox
-----------------------------------
```

Easy peasy! Need to add a password to your collection?

```bash
$ danpass add -s google.com -u notjohndoe@example.com -p asurprise
Added entry to danpass!
```

Doesn't get much easier than that! :)



