defmodule CustomWrapperTest do
  use ExUnit.Case
  doctest CustomWrapper

  test "greets the world" do
    assert CustomWrapper.hello() == :world
  end
end
