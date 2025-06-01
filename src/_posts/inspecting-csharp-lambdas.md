---
title: "InspecTree: C# Expression<T> with statement body support"
excerpt: "You might have heard of, or used, Expression<T> in C#. They're very useful, but suffer from the major limitation of not supporting lambdas with statement bodies. Well, it's time we change that, and I'm here to tell you how I did it. Here's my journey of creating InspecTree, a .NET library that uses source generators and interceptors to allow you to inspect entire C# lambdas."
date: "2024-09-14"
author:
  name: "dcronqvist"
  picture: "/assets/blog/authors/dcronqvist.jpg"
tags: ["csharp", "dotnet", "prog-langs"]
---

#  What's an `Expression<T>{:csharp}`?

I strongly suggest you refer to the [official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/expression-trees/expression-trees-execution) for a more in-depth explanation, but in short, an `Expression<T>{:csharp}` is a type in C# that will give you access to a supplied lambda expression as a syntax-tree-like object. This expression tree can then be traversed and inspected, and you can do all sorts of cool things with it, e.g. transpile it to another language, or even execute it.

# The problem

I have a long-lasting project that is a rendering engine. In that rendering engine, I wanted to be able to write shaders in C# and then transpile them to some shader language, like GLSL or HLSL. With the help of `Expression<T>{:csharp}`, I could easily inspect the lambda expressions that represented the shaders and transpile them to the desired language. However, that only got me so far... The shaders I was able to write could only contain a single expression that would return a value for the pixel color. Like this:

```csharp showLineNumbers noScroll
var shader = _renderer.CreateFragmentShader(() => 
  new Vector4(1, 0, 0, 1) * opacity);
```

But I wanted more! I wanted to be able to write routines, with control flow, sub-routines, and all that jazz, all in lambdas. I wanted to be able to write something like this:

```csharp showLineNumbers
var shader = _renderer.CreateFragmentShader(() => 
{
  var color = new Vector4(1, 0, 0, 1);
  
  if (someCondition) {
    color = new Vector4(0, 1, 0, 1);
  }

  if (someOtherCondition) {
    color = SampleTexture2D(someTexture, someUV) * color;
  }

  return color;
});
```
And have it be transpiled to something like this:

```glsl showLineNumbers
void main() {
  vec4 color = vec4(1, 0, 0, 1);
  
  if (someCondition) {
    color = vec4(0, 1, 0, 1);
  }

  if (someOtherCondition) {
    color = texture(someTexture, someUV) * color;
  }

  gl_FragColor = color;
}
```

But that simply wasn't possible with `Expression<T>{:csharp}`, due to the following limitation [CS0834 - A lambda expression with a statement body cannot be converted to an expression tree](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-messages/expression-tree-restrictions?f1url=%3FappId%3Droslyn%26k%3Dk(CS0834)). There are ways to create expression trees that contain several statements with the help of [`BlockExpression{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/system.linq.expressions.blockexpression?view=net-8.0). However, those blocks and statements need to be created manually, which isn't very cool. So I set out to solve this problem, and the result is a library I call [**InspecTree**](https://github.com/dcronqvist/InspecTree). 

# Attempts by others

I'm obviously not the only one to have encountered this problem. In fact, it's mentioned several times in this [GitHub issue](https://github.com/dotnet/csharplang/issues/2545) on the C# language design repository. The closest thing I could find was a library called [ExpressionFutures](https://github.com/bartdesmet/ExpressionFutures). It's a library that extends the capabilities of `Expression<T>{:csharp}` by providing a custom fork of the Roslyn compiler. My aim was to create something that was much more lightweight and easy to use, where you still could make use of the standard C# compiler.

# My vision

I wanted a similar API to `Expression<T>{:csharp}`, but for entire methods. I envisioned something like this in my rendering engine:

```csharp showLineNumbers {25}
void Main()
{
  var shader = CreateFragmentShader(color => 
  {
    if (someCondition) {
      color = new Vector4(0, 1, 0, 1);
    }

    if (someOtherCondition) {
      color = SampleTexture2D(someTexture, someUV) * color;
    }

    return color;
  });
}

Shader CreateFragmentShader(InspecTree<Func<Vector4, Vector4>> shader)
{
  var glslCode = TransileToGLSL(shader);
  return _renderer.CreateShaderFromGLSL(glslCode);
}

string TransileToGLSL(InspecTree<Func<Vector4, Vector4>> shader)
{
  var syntaxTree = shader.SyntaxTree;
  var glslTranspiler = new GLSLTranspiler();
  var glslCode = glslTranspiler.Transpile(syntaxTree);
  return glslCode;
}
```

Line 25 `.SyntaxTree{:csharp}` is the key here. It should give you the syntax tree of the supplied method, which you then can traverse, inspect, and transpile to another language. I wanted to use existing Roslyn APIs to achieve this, and expose a [`SyntaxTree{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.syntaxtree?view=roslyn-dotnet-4.9.0) instance, for which there already exists visitors and other utilities.

However, it quickly became apparent that this would be a much more complex challenge than I first anticipated. You are about to learn about the challenges I faced, and how I solved them in the following sections.

# You cannot implicitly convert a lambda to a custom class

The first challenge I faced was that I wanted to be able to pass a lambda to a method that had a parameter of type `InspecTree<T>{:csharp}`. I thought that an implicit conversion operator from a `Func<T>{:csharp}` to an `InspecTree<T>{:csharp}` would solve this, but that was not the case. The compiler is not able to first implicitly convert a lambda to a `Func<T>{:csharp}`, and then implicitly convert that `Func<T>{:csharp}` to an `InspecTree<T>{:csharp}` ([StackOverflow](https://stackoverflow.com/questions/21985005/how-can-i-do-an-implicit-conversion-from-a-lambda-expression-to-a-custom-class)). So I had to come up with another solution.

I had dabbled a bit with [C# source generators](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/source-generators-overview) in the past, and figured that I could give them a try. I created a source generator that would generate an overload for any method that accepts an `InspecTree<T>{:csharp}` parameter. This overload would instead accept a `Func<T>{:csharp}` parameter, and then create an `InspecTree<T>{:csharp}` instance from that lambda. 

Given the following consumer project:

```csharp showLineNumbers
partial class Program
{
  static void Main(string[] args)
  {
    Test(x =>
    {
      var y = x + 1;
      return y;
    });
  }

  static void Test(InspecTree<Func<int, int>> func)
  {
    Console.WriteLine(func.Delegate.Invoke(42))
  }
}
```

The source generator generates the following overload for the `Test{:csharp}` method:

```csharp showLineNumbers
partial class Program
{
  static void Test(Func<int, int> func)
  {
    var overload_func = new InspecTree<Func<int, int>>(func);
    Test(overload_func);
  }
}
```

With that in place, I could now pass a lambda to a method that accepted an `InspecTree<T>{:csharp}` parameter. The source generator would take care of the conversion for me.

# Getting the syntax tree of a lambda

Now we are getting to the juicy part. How do you get the syntax tree of a lambda? Well, it turns out that you can't. At least not directly. I had several ideas on how to solve this though, but I will only mention the first *failed* attempt and then the successful one.

**Failed:** Generate an equivalent `SyntaxTree{:csharp}` using [`SyntaxFactory{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntaxfactory?view=roslyn-dotnet-4.9.0) from a source generator for all lambdas in a program. This would be a very complex task. I would need to keep track of lambda -> `SyntaxTree{:csharp}` mappings, and then somehow inject the generated SyntaxTree into the lambda. I quickly dismissed this idea.

**Successful:** Use the [`CSharpSyntaxTree.ParseText{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.csharpsyntaxtree.parsetext?view=roslyn-dotnet-4.9.0) in combination with [interceptors](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12#interceptors), a new feature in C# 12. Interceptors are extremely powerful in that they can replace any invocation to a method with a completely different method, and they were perfect for this use case.

I started by modifying my existing source generator to instead only generate a completely empty overload, like this:

```csharp showLineNumbers
partial class Program
{
  static void Test(Func<int, int> func)
  {
    // Empty overload
  }
}
```

The idea was that this overload was now only for the purpose of allowing consumers to pass a lambda to a method that accepted an `InspecTree<T>{:csharp}` parameter without a compilation error.

Then I created a new source generator that would generate interceptors for all invocations to this generated overload. In the following example, the only invocation is in the `Main{:csharp}` method:

```csharp showLineNumbers {5-9}
partial class Program
{
  static void Main(string[] args)
  {
    Test(x =>
    {
      var y = x + 1;
      return y;
    });
  }

  static void Test(InspecTree<Func<int, int>> func)
  {
    Console.WriteLine(func.Delegate.Invoke(42))
  }
}
```

The interceptor source generator then finds all invocations to these overloads, retrieves the syntax trees from the supplied arguments to the methods, and then intercepts each invocation individually. The interceptor source generator generates the following code for the invocation in the `Main{:csharp}` method:

```csharp showLineNumbers
[System.Runtime.CompilerServices.InterceptsLocation(@"absolute/path/to/Program.cs", line: 5, character: 5)]
public static void Test__INTERCEPTED_absolute_path_to_Program_cs__7__5(Func<int, int> func)
{
  var overload_func = new InspecTree<Func<int, int>>(func,
  """
  x =>
      {
        var y = x + 1;
        return y;
      }
  """);
  Test(overload_func);
}
```

If there would have been two calls to the `Test{:csharp}` overload, there would be two interceptors generated, each with their own unique lambda syntax tree string representation.

All I had to do after this was to parse the lambda syntax tree string inside the `InspecTree<T>{:csharp}` constructor, and then I would have the syntax tree of the lambda. Using a simple [`CSharpSyntaxWalker{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.csharpsyntaxwalker?view=roslyn-dotnet-4.9.0), I could traverse the syntax tree and extract the information I needed.

# Conclusion

Although challenging, I managed to find a way to inspect entire C# methods using the Roslyn APIs. Source generators and Interceptors were key in solving this problem, and I'm very happy with the result. The library is still in its early stages, but I'm planning on making it public soon.