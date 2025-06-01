---
title: "Making a fast and memory efficient Tiled parsing library in C#"
excerpt: "Tiled is a popular open source map editor for 2D games. Several libraries parsing the different Tiled map formats exist for .NET. Many of them have gone old and outdated though, and I took it upon myself to create a new one called DotTiled, with a focus on speed and memory efficiency."
date: "2024-09-17"
author:
  name: "dcronqvist"
  picture: "/assets/blog/authors/dcronqvist.jpg"
tags:
  - game-dev
  - dotnet
keywords:
  - tiled
  - tiled map editor
  - tiled map parsing
  - c#
  - dotnet
  - game development
  - game dev
  - 2d games
  - map editor
  - DotTiled
  - dcronqvist
  - benchmarking
  - performance
  - memory efficiency
---

# What's Tiled?

[Tiled is a popular open source map editor for 2D games](https://www.mapeditor.org/). It supports several file export formats, often times even specialized ones for specific game engines. I recommend you check it out if you haven't already. It's a great tool for creating 2D maps for your games and then exporting them in a format like JSON or XML to be used in your game engine of choice.

# The problem

In my never-ending game development journey, I've used Tiled for several projects. I've therefore also used many of the existing libraries for parsing Tiled maps in my .NET projects. However, a lot of these libraries seem to lack in the features that they support, or they are outdated and no longer maintained, or lack in documentation making them difficult to use.

I wanted to use many of the newer features in Tiled, e.g. [custom types](https://doc.mapeditor.org/en/stable/manual/custom-properties/#custom-types). Unfortunately, none of the libraries I found supported the features I wanted. So I decided to create my own library, and made it a challenge for myself to make it as fast and memory efficient as possible, using [BenchmarkDotNet](https://benchmarkdotnet.org/) to measure and compare performance.

> **Note:** This article is not about the library I created itself, but rather about the process of creating it. I will not go into detail about the library's features, but rather focus on the process of creating a fast and memory efficient Tiled parsing library in C#. If you just want a link to the library -> [DotTiled](https://github.com/dcronqvist/DotTiled).

# Reflection-based parsers

Many of the existing libraries use reflection to parse the Tiled maps. This is a very flexible way of parsing the maps, but it comes with a relatively heavy performance cost. Here's what a reflection-based parser might look like for a Tiled map:

```csharp showLineNumbers
[XmlRoot("map")]
public class TiledMap
{
  public enum OrientationType
  {
    [XmlEnum("orthogonal")]
    Orthogonal,
  
    [XmlEnum("isometric")]
    Isometric,
  
    [XmlEnum("staggered")]
    Staggered,
  
    [XmlEnum("hexagonal")]
    Hexagonal
  }
  
  [XmlAttribute("version")]
  public int Version = 1;
  
  [XmlAttribute("orientation")]
  public OrientationType Orientation = OrientationType.Orthogonal;
  
  [XmlAttribute("width")]
  public int Width;
  
  [XmlAttribute("height")]
  public int Height;
  
  // Classes which have similar parsing
  [XmlElement("layer", typeof(TiledTileLayer))]
  [XmlElement("objectgroup", typeof(TiledObjectGroup))]
  [XmlElement("imagelayer", typeof(TiledImageLayer))]
  public List<TiledBaseLayer> Layers;
}
```

A class like this can then be used with an [`XmlSerializer{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/system.xml.serialization.xmlserializer) to parse the Tiled map from an XML string or file. This is a very simple example and does not represent an entire Tiled map, but you can imagine how this could be extended to support entire maps and all their properties. You could apply similar attributes to classes like these to also support the different types of map formats that Tiled support.

# What other options besides reflection are there?

Reflection is a powerful tool, and is often times a very appropriate one when it comes to parsing data and mapping them to corresponding classes. However, in this case, I wanted to make a library that was as fast and memory efficient as possible. Reflection is not the best tool for that job. Instead, I decided to use a more manual approach, where I would parse the XML or JSON files myself, without reflection.

# Manual parsing

C# has a useful [`XmlReader{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/system.xml.xmlreader) class that allows you to read XML strings in a forward-only manner. This is a very efficient way of parsing XML, as you only read the parts of the XML that you need, and you don't have to load the entire XML file into memory. 

For JSON, there is a similar forward-only reader called [`Utf8JsonReader{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.utf8jsonreader). While it is fast and efficient, I decided against using it for this project as it is a bit more cumbersome than the *relatively lightweight* alternative: [`JsonDocument{:csharp}`](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsondocument). `JsonDocument{:csharp}` is a bit heavier on memory, but it is easier to work with and is still relatively fast. And as benchmarks showed later, it was quite a lot faster than using reflection.

Here's how I parse a Tiled map using `XmlReader{:csharp}`:

```csharp showLineNumbers
internal Map ReadMap()
{
  var version = _reader.GetRequiredAttribute("version");
  var tiledVersion = _reader.GetOptionalAttribute("tiledversion");
  var @class = _reader.GetOptionalAttribute("class").GetValueOr("");
  var orientation = _reader.GetRequiredAttributeEnum<MapOrientation>("orientation", Helpers.CreateMapper<MapOrientation>(
    s => throw new InvalidOperationException($"Unknown orientation '{s}'"),
    ("orthogonal", MapOrientation.Orthogonal),
    ("isometric", MapOrientation.Isometric),
    ("staggered", MapOrientation.Staggered),
    ("hexagonal", MapOrientation.Hexagonal)
  ));
  var renderOrder = _reader.GetOptionalAttributeEnum<RenderOrder>("renderorder", s => s switch
  {
    "right-down" => RenderOrder.RightDown,
    "right-up" => RenderOrder.RightUp,
    "left-down" => RenderOrder.LeftDown,
    "left-up" => RenderOrder.LeftUp,
    _ => throw new InvalidOperationException($"Unknown render order '{s}'")
  }).GetValueOr(RenderOrder.RightDown);
  var compressionLevel = _reader.GetOptionalAttributeParseable<int>("compressionlevel").GetValueOr(-1);
  var width = _reader.GetRequiredAttributeParseable<uint>("width");
  var height = _reader.GetRequiredAttributeParseable<uint>("height");
  var tileWidth = _reader.GetRequiredAttributeParseable<uint>("tilewidth");
  var tileHeight = _reader.GetRequiredAttributeParseable<uint>("tileheight");
  var hexSideLength = _reader.GetOptionalAttributeParseable<uint>("hexsidelength");
  var staggerAxis = _reader.GetOptionalAttributeEnum<StaggerAxis>("staggeraxis", s => s switch
  {
    "x" => StaggerAxis.X,
    "y" => StaggerAxis.Y,
    _ => throw new InvalidOperationException($"Unknown stagger axis '{s}'")
  });
  var staggerIndex = _reader.GetOptionalAttributeEnum<StaggerIndex>("staggerindex", s => s switch
  {
    "odd" => StaggerIndex.Odd,
    "even" => StaggerIndex.Even,
    _ => throw new InvalidOperationException($"Unknown stagger index '{s}'")
  });
  var parallaxOriginX = _reader.GetOptionalAttributeParseable<float>("parallaxoriginx").GetValueOr(0.0f);
  var parallaxOriginY = _reader.GetOptionalAttributeParseable<float>("parallaxoriginy").GetValueOr(0.0f);
  var backgroundColor = _reader.GetOptionalAttributeClass<Color>("backgroundcolor").GetValueOr(Color.Parse("#00000000", CultureInfo.InvariantCulture));
  var nextLayerID = _reader.GetRequiredAttributeParseable<uint>("nextlayerid");
  var nextObjectID = _reader.GetRequiredAttributeParseable<uint>("nextobjectid");
  var infinite = _reader.GetOptionalAttributeParseable<uint>("infinite").GetValueOr(0) == 1;

  var propertiesCounter = 0;
  List<IProperty> properties = Helpers.ResolveClassProperties(@class, _customTypeResolver);
  List<BaseLayer> layers = [];
  List<Tileset> tilesets = [];

  _reader.ProcessChildren("map", (r, elementName) => elementName switch
  {
    "properties" => () => Helpers.SetAtMostOnceUsingCounter(ref properties, Helpers.MergeProperties(properties, ReadProperties()).ToList(), "Properties", ref propertiesCounter),
    "tileset" => () => tilesets.Add(ReadTileset(version, tiledVersion)),
    "layer" => () => layers.Add(ReadTileLayer(infinite)),
    "objectgroup" => () => layers.Add(ReadObjectLayer()),
    "imagelayer" => () => layers.Add(ReadImageLayer()),
    "group" => () => layers.Add(ReadGroup()),
    _ => r.Skip
  });

  return new Map
  {
    Version = version,
    TiledVersion = tiledVersion,
    Class = @class,
    Orientation = orientation,
    RenderOrder = renderOrder,
    CompressionLevel = compressionLevel,
    Width = width,
    Height = height,
    TileWidth = tileWidth,
    TileHeight = tileHeight,
    HexSideLength = hexSideLength,
    StaggerAxis = staggerAxis,
    StaggerIndex = staggerIndex,
    ParallaxOriginX = parallaxOriginX,
    ParallaxOriginY = parallaxOriginY,
    BackgroundColor = backgroundColor,
    NextLayerID = nextLayerID,
    NextObjectID = nextObjectID,
    Infinite = infinite,
    Properties = properties ?? [],
    Tilesets = tilesets,
    Layers = layers
  };
}
```

Pretty verbose, right? In fact, it would have been much more verbose if it wasn't for the amount of extension methods I've created for `XmlReader{:csharp}`. The `GetRequiredAttribute{:csharp}` and `GetOptionalAttribute{:csharp}` are examples of such extension methods that make it easier for me to semantically argue about the attributes I expect to be there. 

However, even though it is quite verbose: it's readable and fast. The `ReadTileLayer{:csharp}`, `ReadObjectLayer{:csharp}`, `ReadImageLayer{:csharp}`, and `ReadGroup{:csharp}` all look very similar to `ReadMap{:csharp}` and read their corresponding expected attributes and elements.

For JSON, it is extremely similar; I made identical extension methods to `JsonElement{:csharp}` to be able to retrieve values in a *required* or *optional* manner.

# Benchmarking my library DotTiled against other libraries

After all this effort, it would be a shame if it turned out that it was only marginally faster than the reflection-based parsing. However, it turned out to be quite a lot faster.

Below is the output from [`BenchmarkDotNet`](https://benchmarkdotnet.org/) when comparing [`DotTiled`](https://github.com/dcronqvist/DotTiled) against two other similar libraries that use reflection-based parsing.

```sh showLineNumbers
BenchmarkDotNet v0.13.12, Windows 10 (10.0.19045.4780/22H2/2022Update)
12th Gen Intel Core i7-12700K, 1 CPU, 20 logical and 12 physical cores
.NET SDK 8.0.202
  [Host]     : .NET 8.0.3 (8.0.324.11423), X64 RyuJIT AVX2
  DefaultJob : .NET 8.0.3 (8.0.324.11423), X64 RyuJIT AVX2

| Method      | Categories    | Mean     | Ratio | Allocated | Alloc Ratio |
|------------ |-------------- |---------:|------:|----------:|------------:|
| DotTiled    | MapJsonString | 4.249 μs |  1.00 |   5.65 KB |        1.00 |
| TiledLib    | MapJsonString | 5.904 μs |  1.39 |   9.02 KB |        1.60 |
|             |               |          |       |           |             |
| DotTiled    | MapXMLString  | 2.986 μs |  1.00 |  16.47 KB |        1.00 |
| TiledLib    | MapXMLString  | 5.372 μs |  1.80 |  23.32 KB |        1.42 |
| TiledCSPlus | MapXMLString  | 6.318 μs |  2.12 |  33.16 KB |        2.01 |
```

From the above table, it's clear that [`DotTiled`](https://github.com/dcronqvist/DotTiled) is about 45% faster at parsing a small and simple map (in the XML format) than the runner-up `TiledLib`, and more than 50% faster than `TiledCSPlus`.

The JSON format is not as drastic, likely due to the usage of `JsonElement{:csharp}`, which has a larger overhead than the forward-only reader `Utf8JsonReader{:csharp}`. Still, a close to 30% increase in speed for a simple map is a great result. 

> **Note**: `TiledCSPlus` does not have support for the JSON map format, which is why it isn't included in the benchmarks for JSON maps.

When it comes to memory, the JSON parsing outperformed `TiledLib` by almost 40%, which is very impressive! The XML parsing also managed to outperform `TiledLib` by around 30%.

# Conclusion

So what's the verdict? Well, [`DotTiled`](https://github.com/dcronqvist/DotTiled) performed about 40% better than `TiledLib` in speed on average, and about 35% better than `TiledLib` in memory usage on average. 

It seems like my efforts on manual parsing really did pay off in the end, and the result is a fast and memory efficient Tiled map parsing library for anyone to use. [The maintainer of Tiled also mentions the library in their documentation](https://doc.mapeditor.org/en/latest/reference/support-for-tmx-maps/). 

