defmodule ElixirLibTest do
  use ExUnit.Case
  doctest ElixirLib

  test "greets the world" do
    assert ElixirLib.hello() == :world
  end
end
