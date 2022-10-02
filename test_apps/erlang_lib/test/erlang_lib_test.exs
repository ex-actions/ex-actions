defmodule ErlangLibTest do
  use ExUnit.Case
  doctest ErlangLib

  test "greets the world" do
    assert ErlangLib.hello() == :world
  end
end
