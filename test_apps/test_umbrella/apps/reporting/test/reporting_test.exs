defmodule ReportingTest do
  use ExUnit.Case
  doctest Reporting

  test "greets the world" do
    assert Reporting.hello() == :world
  end
end
