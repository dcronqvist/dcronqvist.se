---
date: '2024-10-05T11:51:10+02:00'
draft: false
title: 'Extending InspecTree with support for semantic analysis'

tags:
  - csharp
  - dotnet
  - prog-langs
keywords:
  - c#
  - csharp
  - dotnet
  - .net
  - semantic analysis
  - roslyn
  - syntax tree
  - lambda expressions
  - transpiler
  - syntax tree traversal
showToc: true
TocOpen: false
hidemeta: false
comments: false
description: I recently created a library, InspecTree, that allows you to inspect and analyze entire C# lambdas. In this post, I will show you how I extended InspecTree to also support semantically analyzing the lambdas.'
disableHLJS: false # to disable highlightjs
disableShare: true
disableHLJS: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false
---

In my [previous post](/posts/inspecting-csharp-lambdas/), I showed how I wanted to transpile my C# lambdas to GLSL shaders in my rendering engine. I created a library, InspecTree, which gives you access to the entire syntax tree of a lambda, statement bodies and all. This was a great start, but I quickly realized that I would want more than just the syntax tree. I would also want to know the types of the variables, the return type of the lambda, which methods that were being called inside the lambda, and more specifically check if a lambda is capturing one or more variables from an outer scope (more on why this would be a problem later).

Before reading on, I highly recommend you check out my [previous post](/posts/inspecting-csharp-lambdas/) to get a better understanding of what InspecTree is and how it works. Also check out the official Microsoft documentation on semantic analysis in C# [here](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/work-with-semantics).

# How do I semantically analyze a lambda?

There's a pretty simple answer to that actually, you need an instance of a [`SemanticModel`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.semanticmodel?view=roslyn-dotnet-4.9.0) which has a bunch of useful methods for retrieving symbols for different syntax trees. With that, you can get the type of different symbols, which methods that are being invoked and a bunch of other useful stuff. A `SemanticModel` can be retrieved from a [`Compilation`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.compilation?view=roslyn-dotnet-4.9.0), which leads us to the next question: how do I get a `Compilation` from my lambdas?

# Source generating a compilation for a lambda

First thing to do is add a new property to the `InspecTree<T>` class so that we can store the `SemanticModel` for the lambda, so that users of the library can access it properly.

```csharp {linenos=true,hl_lines=[5]}
public class InspecTree<TDelegate> where TDelegate : Delegate
{
  public TDelegate Delegate { get; }
  public LambdaExpressionSyntax LambdaSyntax { get; }
  public SemanticModel SemanticModel { get; }
}
```

And then, creating a compilation is pretty easy, all we need to do is do something like this:

```csharp {linenos=true,hl_lines=[15,16]}
var source = @"() =>
{
  float x = 2 + 5;
  Vector4 color = new Vector4(1.0f);

  if (x > 4)
  {
    color = new Vector4(0.2f, 0.3f, x, 1.0f);
  }

  return color;
}
";
var syntaxTree = CSharpSyntaxTree.ParseText(source);
var compilation = CSharpCompilation.Create("compilation")
  .AddSyntaxTrees(syntaxTree);
```

But that unfortunately won't suffice... The problem is that you need to make sure to add all needed references to the compilation. In the above example, we're using the `Vector4` type, which is part of the `System.Numerics` namespace. So we need to add a reference to that assembly during our compilation.

```csharp {linenos=true,hl_lines=[2]}
var compilation = CSharpCompilation.Create("compilation")
  .AddReferences(MetadataReference.CreateFromFile(typeof(Vector4).Assembly.Location));
  .AddSyntaxTrees(syntaxTree)
```

But even then, we're not done. Since we're not fully qualifying the `Vector4` type, there needs to be a using directive in the source code. So we need to add that as well.

```csharp {linenos=true,hl_lines=[2]}
var source = @"
using System.Numerics;
() =>
{
  float x = 2 + 5;
  Vector4 color = new Vector4(1.0f);

  if (x > 4)
  {
    color = new Vector4(0.2f, 0.3f, x, 1.0f);
  }

  return color;
}";
```

And now we have a compilation that we can get our semantic model from! Now.. how to do this automatically for all the invocations that are intercepted by InspecTree?

# Automatically generating a compilation for all intercepted lambdas

Fortunately, we already collect all usings in the file that an intercepted lambda appears in in InspecTree. We can just add those to the source code before creating our compilation. We now get something like this for our intercepted invocations:

```csharp {linenos=true}
[System.Runtime.CompilerServices.InterceptsLocation(@"absolute\path\to\Program.cs", line: 16, character: 23)]
public static string TranspileCSharpToGLSLFragmentShader__INTERCEPTED_absolute_path_to_Program_cs_16_23(Func<Vector4> insp)
{
  var overload_insp_source = @"
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Numerics;
  using System.Text;
  using Microsoft.CodeAnalysis;
  using Microsoft.CodeAnalysis.CSharp;
  using Microsoft.CodeAnalysis.CSharp.Syntax;

  var overload_insp_lambda = () =>
      {
        var x = 2 + 5f;
        var color = new Vector4(1);

        if (x > 4)
        {
          color = new Vector4(0.2f, 0.3f, x, 1.0f);
        }

        return color;
      }
  ;";
  var overload_insp_syntaxTree = CSharpSyntaxTree.ParseText(overload_insp_source);
  var overload_insp_lambdaDeclaration = overload_insp_syntaxTree.GetRoot().DescendantNodes().OfType<VariableDeclarationSyntax>().Single(x =>
    x.Variables.Single().Identifier.Text == "overload_insp_lambda");
  var overload_insp_lambdaExpression = overload_insp_lambdaDeclaration.DescendantNodes().OfType<LambdaExpressionSyntax>().Single();
  var overload_insp_compilation = CSharpCompilation.Create("overload_insp")
    .AddReferences(MetadataReference.CreateFromFile(typeof(object).Assembly.Location))
    .AddReferences(MetadataReference.CreateFromFile(@"C:\Program Files\dotnet\shared\Microsoft.NETCore.App\8.0.3\System.Linq.dll"))
    .AddReferences(MetadataReference.CreateFromFile(@"C:\Program Files\dotnet\sdk\8.0.202\Roslyn\bincore\Microsoft.CodeAnalysis.dll"))
    .AddReferences(MetadataReference.CreateFromFile(@"C:\Program Files\dotnet\sdk\8.0.202\Roslyn\bincore\Microsoft.CodeAnalysis.CSharp.dll"))
    .AddSyntaxTrees(overload_insp_syntaxTree);
  var overload_insp_semanticModel = overload_insp_compilation.GetSemanticModel(overload_insp_syntaxTree);
  var overload_insp = new InspecTree<Func<Vector4>>(
    insp,
    overload_insp_lambdaExpression,
    overload_insp_semanticModel);
  return TranspileCSharpToGLSLFragmentShader(overload_insp);
}
```

It looks very verbose and a bit messy, but that often ends up being the case for generated code like this. The important thing is that we now have a semantic model for the lambda, which can be used to further analyze the lambda.

# So what can we do with the semantic model?

Like shown in the example for [`InspecTree`](https://github.com/dcronqvist/InspecTree), we can now infer the types of the variables in the lambda and check if the lambda is capturing variables from an outer scope.

Here's a super small example of how I got the types of different expressions in the C# to GLSL transpiler.

```csharp {linenos=true,hl_lines=[3,10]}
private string GetGLSLType(ExpressionSyntax type)
{
  var typeInfo = _semanticModel.GetTypeInfo(type).Type ?? throw new InvalidOperationException($"Could not determine type for {type}");

  if (typeInfo.SpecialType == SpecialType.None)
  {
    var displayString = typeInfo.ToDisplayString();
    return displayString switch
    {
      "System.Numerics.Vector4" => "vec4",
      _ => throw new InvalidOperationException($"Unsupported type {typeInfo.Name}.")
    };
  }

  return typeInfo.SpecialType switch
  {
    SpecialType.System_Single => "float",
    SpecialType.System_Int32 => "int",
    SpecialType.System_Boolean => "bool",
    _ => throw new InvalidOperationException($"Unsupported type {typeInfo.SpecialType}.")
  };
}
```

Furthermore, I added a checker which checks if the lambda is capturing variables from an outer scope. This is important because if it is, then we cannot transpile the lambda to a GLSL shader without first knowing the values of the captured variables - since the transpiler would not know what to substitute the variables with.

```csharp {linenos=true,hl_lines=[1,6]}
int number = GetNumberFromSomewhere();

string glslCode = TranspileCSharpToGLSLFragmentShader(() =>
{
  var x = 2 + 5f;
  var color = new Vector4(number);

  if (x > 4)
  {
    color = new Vector4(0.2f, 0.3f, x, 1.0f);
  }

  return color;
});
```

Without being able to first evaluate the variable `number`, we cannot transpile the lambda to a GLSL shader. This is why it's important to check if the lambda is capturing variables from an outer scope.

In the future I may look into the ability to evaluate the captured variables, but for now I'm happy with the progress I've made.

# Conclusion

I'm very happy with the progress I've made with InspecTree. It's now possible to semantically analyze the lambdas, which opens up a lot of possibilities for the library. I'm excited to see what people will do with it, and I'm looking forward to seeing what I can do with it myself.

Over and out! Here's the repository: [InspecTree](https://github.com/dcronqvist/InspecTree).
