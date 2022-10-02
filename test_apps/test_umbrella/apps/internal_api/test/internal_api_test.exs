defmodule InternalApiTest do
  use ExUnit.Case
  doctest InternalApi

  test "greets the world" do
    assert InternalApi.hello() == :world
  end
end
