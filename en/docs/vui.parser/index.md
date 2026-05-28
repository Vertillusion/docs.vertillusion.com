---
prev: false
next: false
---

# vui.parser

::: tip
- Link: [vui.parser](https://haceau-zoac.github.io/vui.parser/)
- Developer: [辰落火辉 Haceau-Zoac](https://github.com/Haceau-Zoac)  
:::

A simple parser written for [VinaUI](https://github.com/EnderMo/Vina).

For detailed documentation, please refer to [vui.parser](https://haceau-zoac.github.io/vui.parser/).

## Table of Contents
- [Download](#download)
- [Update](#update)
- [vui Syntax](#vui-syntax)

## Download

1. Download [vui.parser.basic.hpp](https://github.com/Haceau-Zoac/vui.parser/blob/main/vui.parser/vui.parser.basic.hpp) to the include directory.
2. Download [vui.parser.hpp](https://github.com/Haceau-Zoac/vui.parser/blob/main/vui.parser/vui.parser.hpp) to the include directory.
3. Test

test.vui

```
Object {
  QAQ(12),
  az("{()}"),
  ch(char),
  str(\"hello,\"),
  astr()
}
```

test.cpp

```cpp
#include <vui.parser.h>
using namespace vui::parser;

int main() {
  auto obj = wfparser(L"test1.vui");
  std::cout << "Parse " << (obj.parse() ? "succeeded" : "failed") << ".\n";
  std::wstring az;
  if (obj.get(L"QAQ", az)) {
    std::wcout << L"QAQ: " << az << '\n';
  } else {
    std::cout << "QAQ: Get failed.\n";
  }
  if (obj.get(L"az", az)) {
    std::wcout << L"az: " << az << '\n';
  } else {
    std::cout << "az: Get failed.\n";
  }
  obj.get(L"ch", az);
  std::wcout << L"ch: " << az << '\n';
  obj.get(L"str", az);
  std::wcout << L"str: " << az << '\n';
  if (obj.get(L"astr", az)) {
    std::wcout << L"astr: " << az << '\n';
  } else {
    std::cout << "astr: Get failed.\n";
  }
```

## Update

[Download](#download) and directly overwrite the old files.

## vui Syntax

*Object Name* : *Object Identifier* { *Data Name*(*Data*), *...* } *...*

Examples:
```
hello {
  world("hello, world!")
}
```
```
foo:bar {
  baz(123)
}
foo:cho {
  vui(5.43)
}
```
```
foo1 {
  u(123),
  d(5.43),
  i(-99),
  s("try")
}
```
```