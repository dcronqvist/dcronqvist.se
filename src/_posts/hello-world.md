---
title: "Hello World!"
excerpt: "I'm excited to start makings posts every now and then about some of the stuff I learn and do. I spend a lot of time programming, reading about programming, and thinking about programming, so I might as well write about it too."
date: "2024-09-12"
author:
  name: dcronqvist
  picture: "/assets/blog/authors/dcronqvist.jpg"
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

Venenatis cras sed felis eget velit. Consectetur libero id faucibus nisl tincidunt. Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus. Volutpat consequat mauris nunc congue nisi vitae. Id aliquet risus feugiat in ante metus dictum at tempor. Sed blandit libero volutpat sed cras. Sed odio morbi quis commodo odio aenean sed adipiscing. Velit euismod in pellentesque massa placerat. Mi bibendum neque egestas congue quisque egestas diam in arcu. Nisi lacus sed viverra tellus in. Nibh cras pulvinar mattis nunc sed. Luctus accumsan tortor posuere ac ut consequat semper viverra. Fringilla ut morbi tincidunt augue interdum velit euismod.

## Lorem Ipsum

```csharp {1} showLineNumbers title="Program.cs"
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace InspecTree.Example;

public partial class Program
{
  public static void Main(string[] _)
  {
    int x = 2;
    Test(n =>
    {
      Console.WriteLine("My own stuff");
      return n * 10 * x;
    });

    Test(n => n * 3);
  }

  public static void Test(InspecTree<Func<int, int>> insp)
  {
    var walker = new SyntaxWalker();
    walker.Visit(insp.SyntaxTree.GetRoot());

    var n = insp.Delegate(2);
    Console.WriteLine(n);
    return;
  }

  private sealed class SyntaxWalker : CSharpSyntaxWalker
  {
    public override void VisitInvocationExpression(InvocationExpressionSyntax node)
    {
      if (node.Expression is MemberAccessExpressionSyntax maes
          && maes.Name.Identifier.Text == "WriteLine"
          && maes.Expression is IdentifierNameSyntax ins
          && ins.Identifier.Text == "Console")
      {
        Console.WriteLine("Found call to Console.WriteLine!");
      }

      base.VisitInvocationExpression(node);
    }

    public override void VisitBinaryExpression(BinaryExpressionSyntax node)
    {
      Console.WriteLine($"Found binary expression: {node}");
      base.VisitBinaryExpression(node);
    }
  }
}
```

Tristique senectus et netus et malesuada fames ac turpis. Ridiculous mus mauris vitae ultricies leo integer malesuada nunc vel. In mollis nunc sed id semper. Egestas tellus rutrum tellus pellentesque. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Quis blandit turpis cursus in hac habitasse platea dictumst quisque. Eros donec ac odio tempor orci dapibus ultrices. Aliquam sem et tortor consequat id porta nibh. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Diam vulputate ut pharetra sit amet. Ut tellus elementum sagittis vitae et leo. Arcu non odio euismod lacinia at quis risus sed vulputate.
